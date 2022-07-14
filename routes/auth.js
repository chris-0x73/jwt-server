import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
const router = express.Router();

router.get("/me", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! Token was not provided." });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  res.status(200).json({ success: true, data: decodedToken });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // DOES USER HAVE ACCOUNT
  const existingUser = await User.findOne({ email: email });
  console.log({ existingUser });
  if (existingUser === null) {
    res.status(400).send({
      success: false,
      message: "login failed. Check your credentials. Did you want to signup?",
    });
  } else {
    try {
      // DOES USER KNOW THE CORRECT PASSWORD
      const passwordIsCorrect = await existingUser.validatePassword(password);
      console.log({ passwordIsCorrect });

      if (!passwordIsCorrect) {
        res.status(400).send({
          success: false,
          message:
            "login failed. Check your credentials. Did you want to signup?",
        });
      } else {
        let token;
        try {
          token = jwt.sign(
            {
              userId: existingUser._id,
              email: existingUser.email,
              isLoggedIn: true,
            },
            process.env.SECRET,
            { expiresIn: "1h" }
          );

          res.status(201).json({
            success: true,
            message: "login successful",
            data: { token },
          });
        } catch (e) {
          console.log({ e });
          res.status(500).send({
            success: false,
            message: "login failed. Please try again later.",
          });
        }
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: "registration failed. Please try again later.",
      });
    }
  }
});

// logout
// register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // check if is already used
  const existingUser = await User.findOne({ email: email });
  if (existingUser !== null) {
    res.status(400).send({
      success: false,
      message: "registration failed. Maybe you already have an account?",
    });
  } else {
    try {
      const createdUser = await User.create({ email, password });
      let token;
      try {
        token = jwt.sign(
          {
            userId: createdUser._id,
            email: createdUser.email,
            isLoggedIn: true,
          },
          process.env.SECRET,
          { expiresIn: "1h" }
        );

        res.status(201).json({
          success: true,
          data: { token },
        });
      } catch (e) {
        res.status(200).send({
          success: true,
          message: "registration was successful. Please log in.",
        });
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: "registration failed. Please try again later.",
      });
    }
  }
});

export default router;

// http://localhost:9999/register

// step 1
// POST
// email: String,
// password: String,

// step 2
// check the email is unique

// step3
// make the password secure before saving it

// step 4
// try to create the user

// step 5
// create JWT that contains some of that info ( id, username, avatar, accountType )

// step 6
// send JWT to the user

// step 7
// .. 3 weeks later, user tries to read their messages, because their JWT
// says they're logged in, the server will authorize their request for their messages

// does login work

// make basic example of authorization
// /messages

// SESSIONS
//   attributes
//     server-side state - a big array of session data
// pros
//   almost zero data overhead -
//   21 chars  http://localhost:8000
//   44 chars  http://localhost:8000 SID: 12739187392173219

// cons
//   you need a persistent state in the backend (db collection) or you'll lose all session when server restarts
//   the ever-increasing cost to hold all the sess data in memory

// JWT
// attributes
//   client-side state - encrypted blob of data in the browser
//   decentralised
//   token based auth

// pros
//   portable - you can talk to any server with the same "secret JWT key" and they can read your data
//   you dont necessarily need to have any persistent state ( db ) on the backend
//   - No Database Table
//   - Simpler to use if careful
//   - Used across services

// cons
//   data overhead - the client needs to send a potentially big token with every / many requests
//     21 chars  http://localhost:8000
//     303 chars http://localhost:8000 Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzNzUyOSwiZW1haWwiOiJib2JAZ21haWwyMjIuY29tIiwicGFzc3dvcmQiOiJkMzMzMzNlZmF1bHRQYXNzd29yZDEyMyIsImlzTG9nZ2VkSW4iOnRydWUsImlhdCI6MTY1NzcxODU4MSwiZXhwIjoxNjU3NzIyMTgxfQ.DOJnK8XMcphgz8MCF0sussqOFHhyHLTFVinIvH5s-rI
//   - Compromised Secret Key
//   - Cannot manage client from the server
//   - Cannot push Messages to clients (Identifying clients from server)
//   - Crypto algorithms can be deprecated
//   - Data Overhead
//   - Complicated to understand

//   "server-side state" and "client-side state"

//   Session ID cookie - REFERENCE to state in the server
//   sessID 1237213987

//   JWT token - NOT a reference to some to state, it IS the state
//   12e91h21i.{user_id:123213,validBefore:8310238921}.sd9aw7cyq21gh2d

import express from "express";
import jwt from "jsonwebtoken";
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

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      {
        userId: Math.floor(Math.random() * 999999),
        email,
        password,
        isLoggedIn: true,
      },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);
  } catch (e) {}
  res.status(201).json({
    success: true,
    data: { token },
  });
});

export default router;

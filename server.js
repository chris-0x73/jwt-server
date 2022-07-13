import express from "express";
import jwt from "jsonwebtoken";

if (!process.env.PORT) {
  console.log("please provide PORT number and try again");
  process.exit();
}
if (!process.env.SECRET) {
  console.log("please provide SECRET and try again");
  process.exit();
}

const app = express();

app.get("/jwt/get", (req, res) => {
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

app.get("/jwt/set", (req, res) => {
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      {
        userId: "71293783",
        email: "bob@gmail.com",
        accountType: "admin",
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

app.listen(process.env.PORT, () =>
  console.log("listening on " + process.env.PORT)
);

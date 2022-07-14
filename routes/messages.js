import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.headers || !req.headers.authorization) {
    res
      .status(403)
      .json({ success: false, message: "Please log in to see your messages" })
      .end();
  }
  const token = req.headers.authorization.split(" ")[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res
      .status(403)
      .json({ success: false, message: "Please log in to see your messages" });
  } else {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId;
    // TODO get all messages from "messages" collection belonging to decodedToken.userId
    res.status(200).json({
      success: true,
      data: [
        { id: 0, from: "bob", to: userId, content: "hey whats up" },
        { id: 1, from: "greeg", to: userId, content: "hey whats up" },
        { id: 2, from: "gerge", to: userId, content: "hey whats up" },
        { id: 3, from: "qwd", to: userId, content: "hey whats up" },
      ],
    });
  }
});

export default router;

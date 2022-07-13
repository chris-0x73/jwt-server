import express from "express";
import authRouter from "./routes/auth.js";

if (!process.env.PORT) {
  console.log("please provide PORT number and try again");
  process.exit();
}
if (!process.env.SECRET) {
  console.log("please provide SECRET and try again");
  process.exit();
}

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

app.listen(process.env.PORT, () =>
  console.log("listening on " + process.env.PORT)
);

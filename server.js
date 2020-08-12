const express = require("express");
const mongoose = require("mongoose");

const redis = require("redis");
const app = express();
const postRouter = require("./routes/posts.js");
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://test:${process.env.MONGODB_PASS}@cluster0.rp63w.mongodb.net/posts`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
  }
);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use("/posts", postRouter);

app.listen(4000, () => {
  console.log("listening to port 4000");
});

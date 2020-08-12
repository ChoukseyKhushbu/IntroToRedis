const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
});

module.exports = mongoose.model("Post", postSchema);

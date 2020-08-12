const express = require("express");
const axios = require("axios");
const router = express.Router();
const Post = require("../models/Posts");
const mongoose = require("mongoose");
const redis = require("redis");


const client = redis.createClient(6379);

function redisMiddleware(req, res, next) {
  const { id } = req.params;
  client.get(id, (err, data) => {
    if (err) {
      throw err;
    }
    if (data != null) {
      console.log("served from redis");
      res.status(200).json(JSON.parse(data));
    } else {
      next();
    }
  });
}

router.get("/:id", redisMiddleware, async (req, res, next) => {
  console.log("served from API");
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    const data = await response.data;

    // sending data
    res.status(200).json(data);

    //Adding data to database
    updateToDatabase(id, data);

    //Adding data to redis
    client.setex(id, 100, JSON.stringify(data));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

async function updateToDatabase(id, data) {

    //Adding the new Post if it does not exist or
    //Solving data redundancy in case if the post data in API has changed and needs to be updated in database.

 Post.findOneAndUpdate({ id: id },{...data},{"upsert":true,"new":true}, function (err, post) {
    if (!err) {
      console.log(post)
    } else {
      console.log(err);
    }
  });
}
module.exports = router;

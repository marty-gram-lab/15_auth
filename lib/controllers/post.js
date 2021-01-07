const { Router } = require("express");
const ensureAuth = require("../middleware/ensure-auth");
const Post = require("../models/Post");

module.exports = Router()
  .post("/", ensureAuth, (req, res, next) => {
    Post.insert({ ...req.body, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  })
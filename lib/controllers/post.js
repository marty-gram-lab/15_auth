const { Router } = require("express");
const ensureAuth = require("../middleware/ensure-auth");
const Post = require("../models/Post");

module.exports = Router()
  .post("/", ensureAuth, (req, res, next) => {
    Post
      .insert({ ...req.body, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  })
  .delete("/:id", ensureAuth, (req, res, next) => {
    const { id } = req.params;

    Post
      .delete({ id, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  })
  .get("/", (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);
  })
  .get("/:id", (req, res, next) => {
    const { id } = req.params;

    Post
      .findById(id)
      .then(post => res.send(post))
      .catch(next);
  })

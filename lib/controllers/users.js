const { Router } = require("express");
const User = require("../models/User");

module.exports = Router()
  .get("/popular", (req, res, next) => {
    User
      .getPopular()
      .then(users => res.send(users))
      .catch(next);
  })
  
  .get("/prolific", (req, res, next) => {
    User
      .getProlific()
      .then(users => res.send(users))
      .catch(next);
  })

  .get("/leader", (req, res, next) => {
    User
      .getLeader()
      .then(users => res.send(users))
      .catch(next);
  })

  .get("/impact", (req, res, next) => {
    User
      .getImpact()
      .then(users => res.send(users))
      .catch(next);
  });

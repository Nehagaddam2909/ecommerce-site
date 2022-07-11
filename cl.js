const express = require("express");
const Path = require("path");
const routes = express.Router();

routes.get("/", (req, res, next) => {
  const usernames = [];
  res.render("default1", {
    probs: usernames,
    docTitle: "usernames",
    path: "/",
  });
});

module.exports = routes;

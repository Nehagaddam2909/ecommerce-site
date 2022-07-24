const express = require("express");
const route = express.Router();
const path = require("path");
const { Router } = require("express");
const usernames = [];

route.get("/users", (req, res) => {
  res.render("users", {
    docTitle: "add user",
    path: "/users",
    islogged: false,
  });
});

route.post("/users", (req, res, next) => {
  usernames.push({ username: req.body.username });
  res.redirect("/");
});

exports.route = route;
exports.usernames = usernames;

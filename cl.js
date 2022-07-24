const express = require("express");
const Path = require("path");
const route = express.Router();
// const Products = require("../models1/products");
// const adminData = require("./admin");
// const Users = require("../models1/users");
route.get("/", (req, res, next) => {
  //const islogged = req.session.islogged;
  const prob = [];
  res.render("default1", { probs: prob, docTitle: "home", islogged: false });
});
route.use("/login", (req, res, next) => {
  res.render("login", { docTitle: "title", islogged: false });
});
module.exports = route;

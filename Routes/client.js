const express = require("express");
const Path = require("path");
const route = express.Router();
const Products = require("../models1/products");
const adminData = require("./admin");
const Users = require("../models1/users");
route.get("/", (req, res, next) => {
  const islogged = req.session.islogged;

  //console.log(req.user);
  Products.find()
    .then((products) => {
      //if (!products.length) {
        res.render("shop", {
          probs: products,
          docTitle: "Shop",
          path: "/",
          islogged: islogged,
        });
      // } else {
      //   
      //   
     // }
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/");
    });
});

module.exports = route;

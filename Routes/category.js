const express = require("express");
const beauty = require("../models1/beauty");
const fashion = require("../models1/fashion");
const electorincs = require("../models1/electronics");
const homeApp = require("../models1/homeApp");
const electronics = require("../models1/electronics");
const route = express.Router();
route.get("/beauty", (req, res, next) => {
  const islogged = req.session.islogged;
  let mn;
  if (islogged) {
    mn = req.session.user.username;
  }
  beauty
    .find()
    .then((products) => {
      //if (!products.length) {
      res.render("fashion", {
        probs: products,
        docTitle: "beauty",
        path: "/beauty",
        islogged: islogged,
        isSeller: req.session.isSeller,
        username: mn,
      });
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/");
    });
});

//adding fashion page
route.use("/fashion", (req, res, next) => {
  const islogged = req.session.islogged;
  let mn;
  if (islogged) {
    mn = req.session.user.username;
  }
  fashion
    .find()
    .then((products) => {
      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        islogged: islogged,
        isSeller: req.session.isSeller,
        username: mn,
      });
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/");
    });
});

//adding fashion page
route.use("/electronics", (req, res, next) => {
  const islogged = req.session.islogged;
  let mn;
  if (islogged) {
    mn = req.session.user.username;
  }
  electronics
    .find()
    .then((products) => {
      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        islogged: islogged,
        isSeller: req.session.isSeller,

        username: mn,
      });
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/");
    });
});

route.use("/homeApp", (req, res, next) => {
  const islogged = req.session.islogged;
  let mn;
  if (islogged) {
    mn = req.session.user.username;
  }
  homeApp
    .find()
    .then((products) => {
      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        islogged: islogged,
        isSeller: req.session.isSeller,

        username: mn,
      });
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/");
    });
});
module.exports = route;

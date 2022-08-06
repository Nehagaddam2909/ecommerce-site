const express = require("express");
const beauty = require("../models1/beauty");
const fashion = require("../models1/fashion");
const electorincs = require("../models1/electronics");
const homeApp = require("../models1/homeApp");
const electronics = require("../models1/electronics");
const products = require("../models1/products");
const route = express.Router();
route.get("/beauty", (req, res, next) => {
  const islogged = req.session.islogged;
  let mn;
  if (islogged) {
    mn = req.session.user.username;
  }
  products
    .find({ category: "beauty" })
    .then((products) => {
      //if (!products.length) {
      res.render("fashion", {
        probs: products,
        docTitle: "beauty",
        path: "/beauty",
        ispopup: false,
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
  products
    .find({ category: "fashion" })
    .then((products) => {
    //  console.log(products);

      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        ispopup: false,
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
  products
    .find({ category: "electronics" })
    .then((products) => {
      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        ispopup: false,
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
  products
    .find({ category: "homeApp" })
    .then((products) => {
      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        ispopup: false,
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

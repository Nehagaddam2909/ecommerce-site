const express = require("express");
const routes = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const Products = require("../models1/products");
const Users = require("../models1/users");
const Sellers = require("../models1/seler");
const fashion = require("../models1/fashion");
const beauty = require("../models1/beauty");
const Orders = require("../models1/Order");
const electorincs = require("../models1/electronics");
const homeApp = require("../models1/homeApp");
const electronics = require("../models1/electronics");

//addig user login page
//addig user login page
routes.get("/seller-login", (req, res, next) => {
  const islogged = req.session.islogged;
  const isSeller = req.session.isSeller;
  res.render("seller-login", {
    docTitle: "login",
    path: "/login",
    islogged: islogged,
    username: req.session.username,
    isSeller: req.session.isSeller,
    errormessage: req.flash("errormessage")[0],
    informmessage: req.flash("informmessage")[0],
  });
});

//checking the login
routes.post("/seller-login", (req, res, next) => {
  //console.log(req.session.user);
  const email = req.body.email;
  const pass = req.body.password;
  Sellers.findOne({ email: email }).then((user) => {
    if (!user) {
      Sellers.findOne({ username: email }).then((u) => {
        if (!u) {
          req.flash("errormessage", "Invalid email id or password");
          res.redirect("/seller-login");
        } else {
          bcrypt.compare(pass, u.password).then((doMatch) => {
            if (doMatch) {
              req.session.user = u;
              req.session.islogged = true;
              req.session.isSeller = true;
              return req.session.save((err) => {
                const str = req.flash("loginpath")[0];
                //console.log(str);
                if (str) res.redirect(str);
                else res.redirect("/");
              });
            }
            req.flash("errormessage", "Invalud username or password");
            res.redirect("/seller-login");
          });
        }
      });
    } else {
      bcrypt.compare(pass, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          req.session.islogged = true;
          req.session.isSeller = true;
          return req.session.save((err) => {
            const str = req.flash("loginpath")[0];
            //console.log(str);
            if (str) res.redirect(str);
            else res.redirect("/");
          });
        }
        req.flash("errormessage", "Invalud username or password");
        res.redirect("/seller-login");
      });
    }
  });
});

//adding signup page
routes.get("/seller-sign", (req, res, next) => {
  const str = req.flash("errormessage")[0];
  console.log(str);
  req.flash("errormessage", "");
  res.render("seller-sign", {
    docTitle: "seller-sign",
    path: "/seller-sign",
    signuperr: req.flash("signuperr")[0],
    islogged: req.session.islogged,
    username: req.session.username,
    isSeller: req.session.isSeller,
    errormessage: str,
  });
});

//adding data to db
routes.post("/seller-sign", (req, res, next) => {
  const email = req.body.email;

  const username = req.body.username;
  //console.log(username);
  const pass = req.body.password;
  const confirmpass = req.body.confirmpass;
  Sellers.findOne({ email: email }).then((user) => {
    if (user) {
      req.flash("errormessage", "User with email id already exists");
      return res.redirect("/signup");
    }
    return bcrypt
      .hash(pass, 12)
      .then((hashedPassword) => {
        const user = new Sellers({
          email: email,

          password: hashedPassword,
          username: username,
          cart: { items: [] },
          products: { items: [] },
        });
        //console.log(user);
        return user.save();
      })
      .then((result) => {
        req.flash("informmessage", "Sucessfully created user");
        res.redirect("/seller-login");
      });
  });
});

module.exports = routes;

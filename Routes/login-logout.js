const express = require("express");
const routes = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const Products = require("../models1/products");
const Users = require("../models1/users");
const fashion = require("../models1/fashion");
const beauty = require("../models1/beauty");
const Orders = require("../models1/Order");
const electorincs = require("../models1/electronics");
const homeApp = require("../models1/homeApp");
const electronics = require("../models1/electronics");

//addig user login page
routes.get("/login", (req, res, next) => {
  const islogged = req.session.islogged;
  const isSeller = req.session.isSeller;
  res.render("login", {
    docTitle: "login",
    path: "/login",
    islogged: islogged,
    isSeller: isSeller,
    username: req.session.username,
    errormessage: req.flash("errormessage")[0],
    informmessage: req.flash("informmessage")[0],
  });
});

//checking the login
routes.post("/login", (req, res, next) => {
  //console.log(req.session.user);
  const email = req.body.email;
  const pass = req.body.password;
  Users.findOne({ email: email }).then((user) => {
    if (!user) {
      Users.findOne({ username: email }).then((u) => {
        if (!u) {
          req.flash("errormessage", "Invalid email id or password");
          res.redirect("/login");
        } else {
          bcrypt.compare(pass, u.password).then((doMatch) => {
            if (doMatch) {
              req.session.user = u;
              req.session.islogged = true;
              return req.session.save((err) => {
                const str = req.flash("loginpath")[0];
                //console.log(str);
                if (str) res.redirect(str);
                else res.redirect("/");
              });
            }
            req.flash("errormessage", "Invalud username or password");
            res.redirect("/login");
          });
        }
      });
    } else {
      bcrypt.compare(pass, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.user = user;
          req.session.islogged = true;
          return req.session.save((err) => {
            const str = req.flash("loginpath")[0];
            //console.log(str);
            if (str) res.redirect(str);
            else res.redirect("/");
          });
        }
        req.flash("errormessage", "Invalud username or password");
        res.redirect("/login");
      });
    }
  });

  //res.redirect("/");
});

//logout the user
routes.use("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = routes;

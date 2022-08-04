const express = require("express");
const routes = express.Router();
const Products = require("../models1/products");
const Users = require("../models1/users");

//showing the car.then(t
routes.get("/cart", (req, res, next) => {
  const islogged = req.session.islogged;
  const isSeller = req.session.isSeller;
  //console.log(req.session.user instanceof Users);
  if (islogged && !isSeller) {
    Users.findById(req.session.user._id).then((user) => {
      user.populate("cart.items.productId").then((user) => {
        const product = user.cart.items;

        //console.log(product);
        res.render("cart", {
          docTitle: "cart",
          items: product,
          path: "/cart",
          islogged: islogged,
          username: req.session.user.username,

          isSeller: req.session.isSeller,
        });
      });
    });
  } else {
    if (isSeller) {
      req.flash("errormessage", "Seller cannot have cart");
    }
    res.redirect("/login");
  }
});

//adding to the cart
routes.use("/add-to-cart/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const proId = req.params.productID;
  const isSeller = req.session.isSeller;
  if (!islogged || isSeller) {
    const str = "/add-to-cart/" + proId;
    req.flash("loginpath", str);
    if (isSeller) {
      req.flash("errormessage", "Seller cannot have cart");
    }
    res.redirect("/login");
  } else {
    Products.findById(proId)
      .then((product) => {
        //console.log(req.session.user instanceof Users);
        //const user = new Users(req.session.user);

        return req.user.addTocart(product);
      })
      .then((result) => {
        res.redirect("/cart");
      });
  }
});

//deleteing from the cart

routes.use("/delete-from-cart/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const proid = req.params.productID;
  if (!islogged) {
    req.flash("loginpath", "/delete-from-cart/" + proid);
    res.redirect("/login");
  } else {
    req.user
      .removeFromCart(proid)
      .then((product) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  }
});

module.exports = routes;

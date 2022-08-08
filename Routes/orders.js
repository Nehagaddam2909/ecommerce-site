const express = require("express");
const routes = express.Router();
const Products = require("../models1/products");
const Users = require("../models1/users");
const Orders = require("../models1/Order");
//placing the order
routes.use("/orders", (req, res, next) => {
  const islogged = req.session.islogged;
  if (!islogged) {
    req.flash("loginpath", "/orders");
    res.redirect("/login");
  } else {
    let list = {};
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const getProduct = user.cart.items.map((i) => {
          return { product: { ...i.productId._doc }, quantity: i.quantity };
        });

        if (getProduct.length > 0) {
          const orders = new Orders({
            Products: getProduct,
            user: {
              userId: req.session.user._id,
              email: req.session.user.email,
              username: req.session.user.username,
              isSeller: req.session.isSeller,
            },
          });
          return orders.save();
        }
      })
      .then((result) => {
        Users.findById(req.session.user._id)
          .then((user) => {
            user.clearCart();
            res.redirect("/get-order");
          })

          .catch((err) => {
            console.log(err);
          });
      });
  }
});

//getting the order
routes.use("/get-order", (req, res, next) => {
  const islogged = req.session.islogged;
  if (!islogged) {
    req.flash("loginpath", "/get-order");
    res.redirect("/login");
  } else {
    //console.log(req.session.user);
    Orders.find({ "user.userId": req.session.user._id }).then((result) => {
      //  console.log(result);

      res.render("order", {
        docTitle: "order",
        path: "/order",
        probs: result,
        islogged: islogged,
        username: req.session.user.username,
        isSeller: req.session.isSeller,
      });
    });
  }
});

module.exports = routes;

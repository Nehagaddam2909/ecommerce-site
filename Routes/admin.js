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
const Sellers = require("../models1/seller_product");
//add products page
routes.get("/add-products", (req, res) => {
  const isSeller = req.session.isSeller;
  const islogged = req.session.islogged;
  if (!isSeller) {
    req.flash("loginpath", "/add-products");
    res.redirect("/seller-login");
  } else {
    res.render("add-products", {
      docTitle: "Add products",
      path: "/add-products",
      islogged: islogged,
      isSeller: isSeller,
      username: req.session.user.username,
    });
  }
});

//for getting the details of particular product
routes.use("/details/:productID/:category", (req, res, next) => {
  const islogged = req.session.islogged;
  const isSeller = req.session.isSeller;
  let mn;
  if (islogged) mn = req.session.user.username;
  let products1 = [];
  const category1 = req.params.category;
  //console.log(category1);
  //checking the category of the product
  Products.find({ category: category1 }).then((products) => {
    products1 = products;
    //console.log(products1);
  });
  //console.log(products1);
  const proid = req.params.productID;
  Products.findById(proid)
    .then((pro) => {
      //    console.log(pro);
      res.render("fashion", {
        docTitle: "details",
        pro: pro,
        probs: products1,
        ispopup: true,
        path: "/details/:productID",
        islogged: islogged,
        isSeller: isSeller,
        username: mn,
      });
    })
    .catch((err) => {
      //console.log(err);
      //res.redirect("/");
    });
});
//to get the data of admin products
routes.get("/admin-products", (req, res, next) => {
  const islogged = req.session.islogged;
  const isSeller = req.session.isSeller;
  if (isSeller) {
    Sellers.findById(req.session.user._id).then((user) => {
      user
        .populate("products.items")
        .then((user) => {
          const product = user.products.items;
          const pro = {
            items: [],
          };
          //console.log(product) ;
          Products.find({ _id: { $in: product } }).then((result) => {
            //pro.items.push(result);
            //console.log(result);
            res.render("edit", {
              probs: result,
              docTitle: "Admin products",
              path: "/admin-products",
              islogged: islogged,
              isSeller: isSeller,
              username: req.session.user.username,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    res.redirect("/seller-login");
  }
});
//for rendering the form of edit data
routes.use("/edit-data/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const proId = req.params.productID;
  const isSeller = req.session.isSeller;
  let mn;
  if (islogged) mn = req.session.user.username;
  Products.findById(proId)
    .then((product) => {
      res.render("edit-data", {
        docTitle: "Edit data",
        path: "/admin-products",
        probs: product,
        islogged: islogged,
        isSeller: isSeller,
        username: mn,
      });
    })
    .catch((err) => {
      //console.log(err);
      res.redirect("/admin-products");
    });
});
//editing the product
routes.use("/edited/:productId", (req, res, next) => {
  const islogged = req.session.islogged;
  const title = req.body.title;
  const price = req.body.price;
  const desc = req.body.desc;
  const url = req.body.url;
  const prod = req.params.productId;
  const cat = req.body.category;

  Products.findById(prod)
    .then((product1) => {
      product1.title = title;
      product1.description = desc;
      product1.price = price;
      product1.imageUrl = url;
      product1.category = cat;
      product1.save().then((result) => {
        // console.log(result);
        return result;
      });
    })
    .then((result) => {
      res.redirect("/admin-products");
    })
    .catch((err) => {
      console.log(err);
    });
});

//deleteing the product details
routes.use("/delete-data/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const prob = req.params.productID;
  const isSeller = req.session.isSeller;
  if (isSeller) {
    Products.findByIdAndRemove(prob)
      .then((result) => {
        Sellers.findById(req.session.user._id)
          .then((user) => {
            user
              .removeProducts(prob)
              .then((product) => {
                res.redirect("/admin-products");
              })
              .catch((arr) => {
                console.log(arr);
              });
          })
          .catch((arr) => {
            console.log(arr);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.flash("loginpath", "/delete-data/" + prob);
    res.redirect("/seller-login");
  }
});
//adding data to mongo db
routes.post("/add-products", (req, res, next) => {
  // console.log(req.session.user);
  const islogged = req.session.islogged;
  const title = req.body.title;
  const price = req.body.price;
  const desc = req.body.desc;
  const url = req.body.url;
  const cat = req.body.category;

  product = new Products({
    title: title,
    price: price,
    description: desc,
    imageUrl: url,
    category: cat,
  });
  //Sellers.findById(req.session.user._id).then((user) => {});
  product
    .save()
    .then((product) => {
      Sellers.findById(req.session.user._id).then((user) => {
        return user.addProducts(product);
      });
    })
    .then((result) => {
      //console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/");
});

//signup
routes.get("/signup", (req, res, next) => {
  const str = req.flash("errormessage")[0];
  console.log(str);
  req.flash("errormessage", "");
  res.render("signup", {
    docTitle: "signup",
    path: "/signup",
    signuperr: req.flash("signuperr")[0],
    islogged: req.session.islogged,
    isSeller: req.session.isSeller,
    username: req.session.username,
    errormessage: str,
  });
});

//adding data to db
routes.post("/signup", (req, res, next) => {
  const email = req.body.email;

  const username = req.body.username;
  console.log(username);
  const pass = req.body.password;
  const confirmpass = req.body.confirmpass;
  Users.findOne({ email: email }).then((user) => {
    if (user) {
      req.flash("errormessage", "User with email id already exists");
      return res.redirect("/signup");
    }
    return bcrypt
      .hash(pass, 12)
      .then((hashedPassword) => {
        const user = new Users({
          email: email,

          password: hashedPassword,
          username: username,
          cart: { items: [] },
        });
        //console.log(user);
        return user.save();
      })
      .then((result) => {
        req.flash("informmessage", "Sucessfully created user");
        res.redirect("/login");
      });
  });
});

exports.routes = routes;
//exports.products = products;

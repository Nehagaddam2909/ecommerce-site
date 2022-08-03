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
const Sellers = require("../models1/seler");
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
routes.use("/details/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const isSeller = req.session.isSeller;
  let mn;
  if (islogged) mn = req.session.user.username;

  const proid = req.params.productID;
  Products.findById(proid)
    .then((pro) => {
      console.log(pro);
      res.render("details", {
        docTitle: "details",
        prob: pro,
        path: "/details/:productID",
        islogged: islogged,
        isSeller: isSeller,
        username: mn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
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
          //console.log(product);
          res.render("edit", {
            probs: product,
            docTitle: "Admin products",
            path: "/admin-products",
            islogged: islogged,
            isSeller: isSeller,
            username: req.session.user.username,
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
  //console.log(proId);
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
      console.log(err);
      // res.redirect("/admin-products");
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
      //product1.category = cat;

      if (cat != product1.category) {
        let cat1 = product1.category;
        product1.category = cat;
        if (cat1 == "fashion") {
          fashion
            .findByIdAndRemove(prod)
            .then((result) => {
              console.log("Successfully deleted");

              //res.redirect("/admin-products");
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (cat1 == "electronics") {
          electorincs
            .findByIdAndRemove(prod)
            .then((result) => {
              console.log("Successfully deleted");
              //res.redirect("/admin-products");
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (cat1 == "beauty") {
          beauty
            .findByIdAndRemove(prod)
            .then((result) => {
              console.log("Successfully deleted");

              //res.redirect("/admin-products");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          homeApp
            .findByIdAndRemove(prod)
            .then((result) => {
              console.log("Successfully deleted");

              //res.redirect("/admin-products");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        let product;
        if (cat == "fashion") {
          product = new fashion({
            _id: prod,
            title: title,
            price: price,
            description: desc,
            imageUrl: url,
          });
        } else if (cat == "electronics") {
          product = new electorincs({
            _id: prod,
            title: title,
            price: price,
            description: desc,
            imageUrl: url,
          });
        } else if (cat == "beauty") {
          product = new beauty({
            _id: prod,
            title: title,
            price: price,
            description: desc,
            imageUrl: url,
          });
        } else {
          //  console.log(cat);
          product = new homeApp({
            _id: prod,
            title: title,
            price: price,
            description: desc,
            imageUrl: url,
          });
        }
        product
          .save()
          .then((result) => {
            Sellers.findById(req.session.user._id).then((user) => {
              console.log(result);
              return user.addProducts(result);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (cat == "fashion") {
          fashion.findById(prod).then((resul) => {
            resul.title = title;
            resul.description = desc;
            resul.imageUrl = url;
            resul.price = price;
            resul.category = cat;

            resul.save();
          });
        } else if (cat == "beauty") {
          beauty.findById(prod).then((resul) => {
            resul.title = title;
            resul.description = desc;
            resul.imageUrl = url;
            resul.price = price;
            resul.category = cat;

            resul.save();
          });
        } else if (cat == "electorincs") {
          electronics.findById(prod).then((resul) => {
            resul.title = title;
            resul.description = desc;
            resul.imageUrl = url;
            resul.price = price;
            resul.category = cat;

            resul.save();
          });
        } else {
          homeApp
            .findById(prod)
            .then((resul) => {
              //console.log(resul);
              resul.title = title;
              resul.description = desc;
              resul.imageUrl = url;
              resul.price = price;
              resul.category = cat;
              resul.save();
            })
            .catch((arr) => {
              console.log(arr);
            });
        }
      }

      product1
        .save()
        .then((product) => {
          Sellers.findById(req.session.user._id).then((user) => {
            return user.addProducts(product);
          });
        })
        .then((result) => {
          console.log(result);
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
        if (result.category == "fashion") {
          fashion.findByIdAndRemove(prob).then((result) => {
            res.redirect("/admin-products");
          });
        } else if (result.category == "beauty") {
          beauty.findByIdAndRemove(prob).then((result) => {
            res.redirect("/admin-products");
          });
        } else if (result.category == "electronics") {
          electronics.findByIdAndRemove(prob).then((result) => {
            res.redirect("/admin-products");
          });
        } else {
          homeApp.findByIdAndRemove(prob).then((result) => {
            res.redirect("/admin-products");
          });

          //  Sellers.findById(())
        }

        Sellers.findById(req.session.user._id)
          .then((user) => {
            user
              .removeProducts(prob)
              .then((product) => {
                console.log(product);
                res.redirect("/admin-products");
              })
              .catch((arr) => {
                console.log(arr);
                //res.redirect("/admin-products");
              });
          })
          .catch((arr) => {
            console.log(arr);
            // res.redirect("/admin-products");
          });
        //console.log(req.session.user);
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
  //products.push({ title: req.body.title });
  const title = req.body.title;
  const price = req.body.price;
  const desc = req.body.desc;
  const url = req.body.url;
  const cat = req.body.category;

  let product;
  if (cat == "fashion") {
    product = new fashion({
      title: title,
      price: price,
      description: desc,
      imageUrl: url,
    });
  } else if (cat == "electronics") {
    product = new electronics({
      title: title,
      price: price,
      description: desc,
      imageUrl: url,
    });
  } else if (cat == "homeApp") {
    product = new homeApp({
      title: title,
      price: price,
      description: desc,
      imageUrl: url,
    });
  } else {
    product = new beauty({
      title: title,
      price: price,
      description: desc,
      imageUrl: url,
    });
  }
  const id = product._id;
  console.log(id);
  product
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });

  product = new Products({
    _id: id,
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
      console.log(product);
      console.log(req.user);
      Sellers.findById(req.session.user._id).then((user) => {
        return user.addProducts(product);
      });
    })
    .then((result) => {
      console.log(result);
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

const express = require("express");
const routes = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const Products = require("../models1/products");
const Users = require("../models1/users");
const Orders = require("../models1/Order");

//add products page
routes.get("/add-products", (req, res) => {
  //console.log(req.session.user);
  //res.cookie("session_id", "12345");

  const islogged = req.session.islogged;
  if (!islogged) {
    req.flash("loginpath", "/add-products");
    res.redirect("/login");
  } else {
    res.render("add-products", {
      docTitle: "Add products",
      path: "/add-products",
      islogged: islogged,
    });
  }
});

//for getting the details of particular product
routes.use("/details/:productID", (req, res, next) => {
  const islogged = req.session.islogged;

  const proid = req.params.productID;
  Products.findById(proid)
    .then((pro) => {
      console.log(pro);
      res.render("details", {
        docTitle: "details",
        prob: pro,
        path: "/details/:productID",
        islogged: islogged,
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
  if (islogged) {
    Products.find()
      .then((product) => {
        res.render("edit", {
          probs: product,
          docTitle: "Admin products",
          path: "/admin-products",
          islogged: islogged,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
});
//for rendering the form of edit data
routes.use("/edit-data/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const proId = req.params.productID;

  Products.findById(proId)
    .then((product) => {
      res.render("edit-data", {
        docTitle: "Edit data",
        path: "/admin-products",
        probs: product,
        islogged: islogged,
      });
    })
    .catch((err) => {
      console.log(err);
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

  Products.findById(prod)
    .then((product) => {
      product.title = title;
      product.description = desc;
      product.price = price;
      product.imageUrl = url;
      return product.save();
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
  if (islogged) {
    Products.findByIdAndRemove(prob)
      .then((result) => {
        console.log("Successfully deleted");
        res.redirect("/admin-products");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.flash("loginpath", "/delete-data/" + prob);
    res.redirect("/login");
  }
});

//showing the car.then(t
routes.get("/cart", (req, res, next) => {
  const islogged = req.session.islogged;
  //console.log(req.session.user instanceof Users);

  Users.findById(req.session.user._id).then((user) => {
    user.populate("cart.items.productId").then((user) => {
      const product = user.cart.items;

      //console.log(product);
      res.render("cart", {
        docTitle: "cart",
        items: product,
        path: "/cart",
        islogged: islogged,
      });
    });
  });
});

//adding to the cart
routes.use("/add-to-cart/:productID", (req, res, next) => {
  const islogged = req.session.islogged;
  const proId = req.params.productID;

  if (!islogged) {
    const str = "/add-to-cart/" + proId;
    req.flash("loginpath", str);

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

//placing the order
routes.use("/orders", (req, res, next) => {
  const islogged = req.session.islogged;
  if (!islogged) {
    req.flash("loginpath", "/orders");
    res.redirect("/login");
  } else {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const getProduct = user.cart.items.map((i) => {
          return { product: { ...i.productId._doc }, quantity: i.quantity };
        });
        const orders = new Orders({
          Products: getProduct,
          user: {
            userId: req.session.user._id,
            email: req.session.user.email,
          },
        });
        //console.log(orders);
        // this.cart.items = [];
        return orders.save();
      })
      .then((result) => {
        Users.findById(req.session.user._id)
          .then((user) => {
            user.clearCart();
          })
          .then(() => {
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
      console.log(result);

      res.render("order", {
        docTitle: "order",
        path: "/order",
        probs: result,
        islogged: islogged,
      });
    });
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

  const product = new Products({
    title: title,
    price: price,
    description: desc,
    imageUrl: url,
  });
  product
    .save()
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
    errormessage: str,
  });
});

//adding data to db
routes.post("/signup", (req, res, next) => {
  const email = req.body.email;
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

//addig user login page
routes.get("/login", (req, res, next) => {
  const islogged = req.session.islogged;
  res.render("login", {
    docTitle: "login",
    path: "/login",
    islogged: islogged,
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
    if (!user) return redirect("/login");

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
  });

  //res.redirect("/");
});

//logout the user
routes.use("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

//adding fashion page
routes.use("/fashion", (req, res, next) => {
  const islogged = req.session.islogged;
  Products.find()
    .then((products) => {
      res.render("fashion", {
        probs: products,
        docTitle: "Shop",
        path: "/",
        islogged: islogged,
      });
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/");
    });
});
exports.routes = routes;
//exports.products = products;

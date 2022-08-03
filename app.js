const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const Users = require("./models1/users");
const session = require("express-session");
const flash = require("connect-flash");
const monogoDbStore = require("connect-mongodb-session")(session);
const cookie = require("cookie-parser");
const mongoose = require("mongoose");
const login = require("./Routes/login-logout");
const adminData = require("./Routes/admin");
const showRoutes = require("./Routes/client");
const category = require("./Routes/category");
const mongoConnect = require("./util/database").MongoConnect;
const cart = require("./Routes/cart");
const orders = require("./Routes/orders");
const seller = require("./Routes/seller");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views1");

const store1 = new monogoDbStore({
  uri: "mongodb+srv://neha:qG839y9U9dwkvmrF@cluster0.tawhqi5.mongodb.net/shop",
  collection: "sessions",
});
// var MemoryStore = session.MemoryStore;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());
app.use(
  session({
    secret: "my secret",
    resave: false,

    saveUninitialized: false,
    store: store1,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    Users.findById(req.session.user._id).then((user) => {
      req.user = user;
      next();
    });
  }
});

app.use(adminData.routes);
app.use(showRoutes);
app.use(category);
app.use(login);
app.use(cart);
app.use(orders);
app.use(seller);
app.use("/", (req, res, next) => {
  const islogged = req.session.islogged;
  let mn;
  if (islogged) mn = req.session.user.username;
  res.status(404).render("pgn", {
    docTitle: "page not found",
    path: "",
    islogged: islogged,
    isSeller: req.session.isSeller,
    username: mn,
  });
});

mongoose
  .connect(
    "mongodb+srv://neha:qG839y9U9dwkvmrF@cluster0.tawhqi5.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    // Users.findOne().then((user) => {
    //   if (!user) {
    //     const user = new Users({
    //       email: "test@gmail.com",
    //       password: "tester",
    //       cart: {
    //         tems: [],
    //       },
    //     });
    //     user.save();
    //   }
    //});

    app.listen(3000);
  })
  .catch((err) => console.log(err));

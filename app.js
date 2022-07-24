const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const en = require("dotenv").config();
const Users = require("./models1/users");
const session = require("express-session");
const flash = require("connect-flash");
const monogoDbStore = require("connect-mongodb-session")(session);
const cookie = require("cookie-parser");
const mongoose = require("mongoose");

const adminData = require("./Routes/admin");
const showRoutes = require("./Routes/client");
const mongoConnect = require("./util/database").MongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views1");

const store1 = new monogoDbStore({
  uri: JSON.stringify(process.env.URI),
  collection: "sessions",
});
console.log(process.env.URI);
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

app.use("/", (req, res, next) => {
  const islogged = req.session.islogged;
  res.status(404).render("pgn", {
    docTitle: "page not found",
    path: "",
    islogged: islogged,
  });
});
const uri = JSON.stringify(process.env.URI);
//console.log(process.env.MONGODB_URI);
mongoose
  .connect(uri)
  .then((result) => {
    Users.findOne().then((user) => {
      if (!user) {
        const user = new Users({
          email: "test@gmail.com",
          password: "tester",
          cart: {
            tems: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const sass = require("node-sass");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", "views");

// app.use(
//   sass.middleware({
//     src: __dirname + "/sass", //where the sass files are
//     dest: __dirname + "/public", //where css should go
//     debug: true, // obvious
//   })
// );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//const adminData = require("./ad");

//app.use(adminData.route);
const client = require("./cl");
app.use(client);

app.use("/", (req, res, next) => {
  res.status(404).render("pgn", { docTitle: "page not found", path: "" });
});

const port = process.env.PORT || 3000;
app.listen(port);

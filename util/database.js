const mongo = require("mongodb");
const mclient = mongo.MongoClient;
let db;
const MongoConnect = () => {
  mclient
    .connect(
      "mongodb+srv://neha:qG839y9U9dwkvmrF@cluster0.tawhqi5.mongodb.net/shop?retryWrites=true&w=majority"
     
    )
    .then((client) => {
      console.log("Connected!");
      db = client.db();
      //callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (db) return db;
  throw "module not found";
};
//module.exports = MongoConnect;
exports.MongoConnect = MongoConnect;
exports.getDb = getDb;

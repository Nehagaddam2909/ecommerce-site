const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema1 = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: {
    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
  },
});

sellerSchema1.methods.addProducts = function (product) {
  const cartProductIndex = this.products.items.findIndex((cp) => {
    return cp._id.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.products.items];
  if (cartProductIndex < 0) {
    updatedCartItems.push({
      _id: product._id,
    });
  } else {
    updatedCartItems[cartProductIndex] = product._id;
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.products = updatedCart;

  return this.save();
};

sellerSchema1.methods.removeProducts = function (proid) {
  const updatedCartItems = this.products.items.filter((item) => {
    return item._id.toString() != proid.toString();
  });

  const updatedCart = {
    items: updatedCartItems,
  };
  //console.log(updatedCart);
  this.products = updatedCart;

  return this.save();
};

module.exports = mongoose.model("Seller_product", sellerSchema1);

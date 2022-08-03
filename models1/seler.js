const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
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
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  products: {
    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

sellerSchema.methods.addProducts = function (product) {
  const cartProductIndex = this.products.items.findIndex((cp) => {
    return cp._id.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.products.items];
  if (cartProductIndex < 0) {
    updatedCartItems.push({
      _id: product._id,
      title: product.title,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
    });
  } else {
    updatedCartItems[cartProductIndex] = product;
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.products = updatedCart;

  return this.save();
};

sellerSchema.methods.removeProducts = function (proid) {
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

module.exports = mongoose.model("Sellers", sellerSchema);

import mongoose from "mongoose";
import Collection from "../database/collection.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required!"],
  },

  price: {
    type: Number,
    required: [true, "price is required!"],
    min: [1, "price must be greater than or equal to 1"],
  },

  quantity: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
    required: [true, "quantity is required!"],
    min: [0, "quantity must be greater than or equal to 0"],
  },
});

const ProductsModel = mongoose.model(Collection.PRODUCTS, productSchema);
export default ProductsModel;

// "products": [
//     {
//         "id": "#####",
//         "name": "MindX",
//         "price": "1000.000",
//         "quantity": 2
//     },
//
// ],

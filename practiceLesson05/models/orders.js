import mongoose from "mongoose";
import Collection from "../database/collection.js";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: [true, "customerId is required!"],
  },

  productId: {
    type: String,
    required: [true, "productId is required!"],
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

  totalPrice: {
    type: Number,
    required: [true, "totalPrice is required!"],
    min: [1, "totalPrice must be greater than or equal to 1"],
  },
});

const OrdersModel = mongoose.model(Collection.ORDERS, orderSchema);
export default OrdersModel;

// "orders": [
//     {
//         "id": "#####",
//         "customerId": "######",
//         "productId": "#######",
//         "quantity": 2
//         "totalPrice": 2000.000
//     },
//
// ],

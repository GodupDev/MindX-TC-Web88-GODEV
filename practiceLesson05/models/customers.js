import mongoose from "mongoose";
import Collection from "../database/collection.js";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required!"],
  },

  email: {
    type: String,
    required: [true, "email is required!"],
    unique: [true, "userEmail already exists!"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
  },

  age: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
    required: [true, "age is required!"],
    min: [1, "userAge must be greater than or equal to 1"],
  },
});

const CustomersModel = mongoose.model(Collection.CUSTOMERS, customerSchema);
export default CustomersModel;

// "customers": [
//     {
//         "id": "#####",
//         "name": "MindX",
//         "email": "",
//         "age": 1
//     },
//
// ],

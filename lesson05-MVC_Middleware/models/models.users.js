import mongoose from "mongoose";
import Collection from "../database/collection.js";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName is required!"],
  },

  userEmail: {
    type: String,
    required: [true, "userEmail is required!"],
    unique: [true, "userEmail already exists!"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
  },
});

const UsersModel = mongoose.model(Collection.USERS, userSchema);
export default UsersModel;

// "users": [
//     {
//         "id": "US001",
//         "userName": "MindX"
//     },
//     {
//         "id": "US002",
//         "useName": "Nobi Nobita"
//     }
// ],

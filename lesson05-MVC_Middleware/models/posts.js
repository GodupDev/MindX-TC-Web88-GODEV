import mongoose from "mongoose";
import Collection from "../database/collection.js";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "userId is required!"],
  },
  content: {
    type: String,
    required: [true, "content is required!"],
  },
});

const PostsModel = mongoose.model(Collection.POSTS, postSchema);
export default PostsModel;

// "posts": [
//         {
//             "id": "PS001",
//             "content": "Nội dung học về JSON Server!",
//             "userId": "US001"
//         }
//     ],

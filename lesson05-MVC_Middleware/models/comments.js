import mongoose from "mongoose";
import Collection from ".././database/collection.js";

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true, "postId is required!"],
  },
  content: {
    type: String,
    required: [true, "content is required!"],
  },
  userId: {
    type: String,
    required: [true, "userId is required!"],
  },
});

const CommentsModel = mongoose.model(Collection.COMMENTS, commentSchema);
export default CommentsModel;

// "comments": [
//         {
//             "id": "CMT001",
//             "postId": "PS001",
//             "content": "Bài học này rất ý nghĩa! Cảm ơn MindX!",
//             "userId": "US002"
//         }
//     ]

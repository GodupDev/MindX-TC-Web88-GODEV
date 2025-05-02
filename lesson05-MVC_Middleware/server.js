import express from "express";
import mongoose from "mongoose";
import usersController from "./controllers/users.js";
import postsController from "./controllers/posts.js";
import commentsController from "./controllers/comments.js";

const PORT = 8080;
const DB_URL = "mongodb://localhost:27017/lesson04";

mongoose.connect(DB_URL);
const app = express();
app.use(express.json());

// Special rude:  email cần duy nhất, id sẽ sử dụng _id mặc định của MongoDB.
app.use((req, res, next) => {
  console.log("Middleware được chạy!");
  next(); //
});

// 1. Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US (ví dụ: US8823).
app.post("/users", usersController.createNewUser);

// 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
app.post("/posts", postsController.createNewPost);

// 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
app.put("/posts/:postId", postsController.editPostById);

// 4. Viết API cho phép user được comment vào bài post
app.post("/posts/:postId/comments", commentsController.createNewComment);

// 5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
app.put("/comments/:commentId", commentsController.editCommentById);

// 6. Viết API lấy tất cả comment của một bài post.
app.get("/comments/:postId", commentsController.getAllCommentsByPostId);

// 7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user .
app.get("/posts", postsController.getAllPosts);

// 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
app.get("/posts/:postId/comments", postsController.getPostById);

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

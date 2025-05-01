import express from "express";
import mongoose from "mongoose";
import UsersModel from "./model/users.js";
import PostsModel from "./model/posts.js";
import CommentsModel from "./model/comments.js";

const PORT = 8080;
const DB_URL = "mongodb://localhost:27017/lesson04";

mongoose.connect(DB_URL);
const app = express();
app.use(express.json());

// Special rude:  email cần duy nhất, id sẽ sử dụng _id mặc định của MongoDB.

// 1. Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US (ví dụ: US8823).

app.post("/users", async (req, res) => {
  try {
    const { userName, userEmail } = req.body;

    const createdUser = await UsersModel.create({
      userName,
      userEmail,
    });

    res.status(201).send({
      data: createdUser,
      message: "Register successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
app.post("/posts", async (req, res) => {
  try {
    const { userId, content } = req.body;

    const existsUserId = await UsersModel.findById(userId);
    if (!existsUserId) {
      return res.status(404).send({
        message: "userId does not exist!",
        data: null,
        success: false,
      });
    }

    const createdPost = await PostsModel.create({
      userId,
      content,
    });

    res.status(201).send({
      data: createdPost,
      message: "Create post successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
app.put("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    const existsPostId = await PostsModel.findById(postId);
    if (!existsPostId) {
      return res.status(404).send({
        message: "postId does not exist!",
        data: null,
        success: false,
      });
    }

    if (existsPostId.userId !== userId) {
      return res.status(403).send({
        message: "You are not the author of this post!",
        data: null,
        success: false,
      });
    }

    const updatedPost = await PostsModel.findByIdAndUpdate(
      postId,
      { content },
      { new: true },
    );

    res.status(200).send({
      data: updatedPost,
      message: "Update post successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 4. Viết API cho phép user được comment vào bài post
app.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, userId } = req.body;

    const existsPostId = await PostsModel.findById(postId);
    if (!existsPostId) {
      return res.status(404).send({
        message: "postId does not exist!",
        data: null,
        success: false,
      });
    }

    const existsUserId = await UsersModel.findById(userId);
    if (!existsUserId) {
      return res.status(404).send({
        message: "userId does not exist!",
        data: null,
        success: false,
      });
    }

    const createdComment = await CommentsModel.create({
      postId,
      content,
      userId,
    });

    res.status(201).send({
      data: createdComment,
      message: "Create post successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
app.put("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const existsCommentId = await CommentsModel.findById(commentId);
    if (!existsCommentId) {
      return res.status(404).send({
        message: "commentId does not exist!",
        data: null,
        success: false,
      });
    }

    if (existsCommentId.userId !== userId) {
      return res.status(403).send({
        message: "You are not the author of this comment!",
        data: null,
        success: false,
      });
    }

    const updatedComment = await CommentsModel.findByIdAndUpdate(
      commentId,
      { content },
      { new: true },
    );

    res.status(200).send({
      data: updatedComment,
      message: "Update comment successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 6. Viết API lấy tất cả comment của một bài post.
app.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const existsPostId = await PostsModel.findById(postId);
    if (!existsPostId) {
      return res.status(404).send({
        message: "postId does not exist!",
        data: null,
        success: false,
      });
    }

    const comments = await CommentsModel.find({ postId });

    res.status(200).send({
      data: comments,
      message:
        comments.length === 0
          ? "No comments yet for this post."
          : "Get comments successful!",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user .
app.get("/posts", async (req, res) => {
  try {
    const posts = await PostsModel.find({});
    const comments = await CommentsModel.find({});

    const result = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post._id.toString(),
      );
      return {
        ...post._doc,
        comments: postComments.slice(0, 3),
      };
    });

    res.status(200).send({
      data: result,
      message: "Get posts successful!",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
app.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    const existsPostId = await PostsModel.findById(postId);
    if (!existsPostId) {
      return res.status(404).send({
        message: "postId does not exist!",
        data: null,
        success: false,
      });
    }

    const comments = await CommentsModel.find({ postId });

    res.status(200).send({
      data: { ...existsPostId._doc, comments },
      message: "Get post successful!",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

import UsersModel from "../models/models.users.js";
import PostsModel from "../models/models.posts.js";
import CommentsModel from "../models/models.comments.js";

const commentsController = {
  createNewComment: async (req, res) => {
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
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        for (const key in err.errors) {
          errors[key] = err.errors[key].message;
        }

        return res.status(400).json({
          status: 400,
          error: "ValidationError",
          message: "Validation failed",
          details: errors,
          success: false,
        });
      }

      res.status(403).send({
        message: err.message,
        data: null,
        success: false,
      });
    }
  },
  editCommentById: async (req, res) => {
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
  },
  getAllCommentsByPostId: async (req, res) => {
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
  },
};

export default commentsController;

import UsersModel from "../models/models.users.js";
import PostsModel from "../models/models.posts.js";
import CommentsModel from "../models/models.comments.js";

const postsController = {
  createNewPost: async (req, res) => {
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

  editPostById: async (req, res) => {
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
  },

  getAllPosts: async (req, res) => {
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
  },

  getPostById: async (req, res) => {
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
  },
};

export default postsController;

import express from "express";
import commentsController from "../controllers/controllers.comments.js";

const router = express.Router();

router.post("/", commentsController.createNewComment);
router.put("/:commentId", commentsController.editCommentById);
router.get("/:postId", commentsController.getAllCommentsByPostId);

export default router;

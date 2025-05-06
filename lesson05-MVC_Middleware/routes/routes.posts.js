import express from "express";
import postsController from "../controllers/controllers.posts.js";

const router = express.Router();

router.post("/", postsController.createNewPost);
router.put("/:postId", postsController.editPostById);
router.get("/", postsController.getAllPosts);

export default router;

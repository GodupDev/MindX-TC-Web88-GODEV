import express from "express";
import usersController from "../controllers/controllers.users.js";

const router = express.Router();

router.post("/", usersController.createNewUser);

export default router;

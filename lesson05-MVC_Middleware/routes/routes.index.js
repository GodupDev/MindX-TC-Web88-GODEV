import { Router } from "express";
import userRouter from "./routes.users.js";
import postRouter from "./routes.posts.js";
import commentRouter from "./routes.comments.js";

const rootRouter = Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/posts", postRouter);
rootRouter.use("/comments", commentRouter);

export default rootRouter;

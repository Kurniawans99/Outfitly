import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  addReplyToPost,
  toggleLikePost,
  toggleLikeReply,
} from "../controller/community.controller.js";

const communityRouter = Router();

communityRouter.use(protect);

communityRouter.route("/").post(createPost).get(getAllPosts);

communityRouter.route("/:postId").get(getPostById);

communityRouter.route("/:postId/replies").post(addReplyToPost);

communityRouter.route("/:postId/like").post(toggleLikePost);

communityRouter.route("/:postId/replies/:replyId/like").post(toggleLikeReply);

export default communityRouter;

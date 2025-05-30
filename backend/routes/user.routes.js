import { Router } from "express";
import {
  getMyProfile,
  updateUserProfile,
  getUserProfileByIdOrUsername,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controller/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js"; // Asumsi Anda membuat ini

const userRouter = Router();

userRouter.get("/me", protect, getMyProfile);
userRouter.put("/me", protect, updateUserProfile);
userRouter.get("/:identifier", getUserProfileByIdOrUsername);

userRouter.post("/:id/follow", protect, followUser);
userRouter.post("/:id/unfollow", protect, unfollowUser);
userRouter.get("/:identifier/followers", getFollowers);
userRouter.get("/:identifier/following", getFollowing);

export default userRouter;

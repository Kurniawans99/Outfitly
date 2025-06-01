// user.routes.js
import { Router } from "express";
import {
  getMyProfile,
  updateUserProfile,
  getUserProfileByIdOrUsername,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  updateAvatar, // Impor controller baru
  updateCoverPhoto, // Impor controller baru
} from "../controller/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const userRouter = Router();

userRouter.get("/me", protect, getMyProfile);
userRouter.put("/me", protect, updateUserProfile);

userRouter.put("/me/avatar", protect, upload.single("avatar"), updateAvatar);
userRouter.put(
  "/me/coverphoto",
  protect,
  upload.single("coverPhoto"),
  updateCoverPhoto
);

userRouter.get("/:identifier", getUserProfileByIdOrUsername);
userRouter.post("/:id/follow", protect, followUser);
userRouter.post("/:id/unfollow", protect, unfollowUser);
userRouter.get("/:identifier/followers", getFollowers);
userRouter.get("/:identifier/following", getFollowing);

export default userRouter;

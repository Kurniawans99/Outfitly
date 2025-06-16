import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  createInspirationPost,
  getAllInspirationPosts,
  getInspirationPostById,
  toggleLike,
  toggleSave,
  addComment,
} from "../controller/inspiration.controller.js";

import multer from "multer";

// Konfigurasi penyimpanan di memori
const storage = multer.memoryStorage();
const inspirationUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const inspirationRouter = Router();

inspirationRouter
  .route("/")
  .get(getAllInspirationPosts)
  .post(protect, inspirationUpload.any(), createInspirationPost);

inspirationRouter.route("/:id").get(getInspirationPostById);

// Aksi yang memerlukan autentikasi
inspirationRouter.route("/:id/like").post(protect, toggleLike);
inspirationRouter.route("/:id/save").post(protect, toggleSave);
inspirationRouter.route("/:id/comments").post(protect, addComment);

export default inspirationRouter;

import { Router } from "express";
import {
  createWardrobeItem,
  getWardrobeItems,
  updateWardrobeItem,
  deleteWardrobeItem,
} from "../controller/wardrobe.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const wardrobeRouter = Router();

wardrobeRouter
  .route("/")
  .post(protect, upload.single("image"), createWardrobeItem)
  .get(protect, getWardrobeItems);

wardrobeRouter
  .route("/:id")
  //   .get(protect, getWardrobeItemById)
  .put(protect, upload.single("image"), updateWardrobeItem)
  .delete(protect, deleteWardrobeItem);

export default wardrobeRouter;

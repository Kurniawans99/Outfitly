import { Router } from "express";
import {
  // Fungsi-fungsi baru untuk lemari
  createWardrobe,
  getWardrobes,
  updateWardrobe,
  deleteWardrobe,

  // Fungsi-fungsi lama yang dimodifikasi untuk pakaian
  createWardrobeItem,
  getWardrobeItems,
  updateWardrobeItem,
  deleteWardrobeItem,
  getWardrobeCategories,
} from "../controller/wardrobe.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const wardrobeRouter = Router();

// Route untuk kategori pakaian (tidak berubah)
wardrobeRouter.route("/categories").get(protect, getWardrobeCategories);

// Routes untuk daftar Lemari (Collections)
wardrobeRouter
  .route("/lists")
  .get(protect, getWardrobes)
  .post(protect, createWardrobe);

wardrobeRouter
  .route("/lists/:id")
  .put(protect, updateWardrobe)
  .delete(protect, deleteWardrobe);

// Routes untuk Pakaian (Items) di dalam sebuah Lemari
wardrobeRouter
  .route("/lists/:wardrobeId/items")
  .post(protect, upload.single("image"), createWardrobeItem)
  .get(protect, getWardrobeItems);

// Routes untuk operasi pada satu item pakaian spesifik
wardrobeRouter
  .route("/items/:id")
  .put(protect, upload.single("image"), updateWardrobeItem)
  .delete(protect, deleteWardrobeItem);

export default wardrobeRouter;

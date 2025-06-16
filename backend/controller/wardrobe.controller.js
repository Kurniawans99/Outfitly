import Wardrobe from "../models/wardrobe/wardrobe.model.js";
import WardrobeItem from "../models/wardrobe/wardrobeItem.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

// Helper untuk upload ke Cloudinary (tidak berubah)
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// --- FUNGSI BARU UNTUK MANAJEMEN LEMARI ---

export const createWardrobe = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newWardrobe = await Wardrobe.create({
      name,
      description,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: newWardrobe });
  } catch (error) {
    next(error);
  }
};

export const getWardrobes = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { user: req.user._id };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Ambil semua lemari dan preview 4 item di dalamnya
    const wardrobes = await Wardrobe.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      ...(search
        ? [{ $match: { name: { $regex: search, $options: "i" } } }]
        : []),
      {
        $lookup: {
          from: "wardrobeitems",
          localField: "_id",
          foreignField: "wardrobe",
          as: "items",
        },
      },
      {
        $addFields: {
          itemCount: { $size: "$items" },
          itemImageUrls: { $slice: ["$items.imageUrl", 4] },
        },
      },
      {
        $project: {
          items: 0, // Hapus field 'items' yang besar agar response lebih ringan
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res
      .status(200)
      .json({ success: true, count: wardrobes.length, data: wardrobes });
  } catch (error) {
    next(error);
  }
};

export const updateWardrobe = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const wardrobe = await Wardrobe.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, description },
      { new: true, runValidators: true }
    );

    if (!wardrobe) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Lemari tidak ditemukan atau Anda tidak punya akses.",
        });
    }
    res.status(200).json({ success: true, data: wardrobe });
  } catch (error) {
    next(error);
  }
};

export const deleteWardrobe = async (req, res, next) => {
  try {
    const wardrobeId = req.params.id;
    const wardrobe = await Wardrobe.findOne({
      _id: wardrobeId,
      user: req.user._id,
    });

    if (!wardrobe) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Lemari tidak ditemukan atau Anda tidak punya akses.",
        });
    }

    // Hapus semua item di dalam lemari ini terlebih dahulu
    await WardrobeItem.deleteMany({ wardrobe: wardrobeId });
    // (Optional: Hapus juga gambar di Cloudinary jika diperlukan)

    // Hapus lemari itu sendiri
    await wardrobe.deleteOne();

    res
      .status(200)
      .json({
        success: true,
        message: "Lemari dan semua isinya berhasil dihapus.",
      });
  } catch (error) {
    next(error);
  }
};

// --- FUNGSI LAMA YANG DIMODIFIKASI UNTUK ITEM PAKAIAN ---

export const createWardrobeItem = async (req, res, next) => {
  try {
    const { wardrobeId } = req.params;
    const { name, category, color, tags, notes } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Gambar pakaian harus diunggah." });
    }

    const result = await streamUpload(req);

    const newItem = await WardrobeItem.create({
      wardrobe: wardrobeId, // tautkan ke lemari
      name,
      category,
      color,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      notes,
      user: req.user._id,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

export const getWardrobeItems = async (req, res, next) => {
  try {
    const { wardrobeId } = req.params;
    const { search, category, color } = req.query;

    let query = { user: req.user._id, wardrobe: wardrobeId };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (color) {
      query.color = { $regex: color, $options: "i" };
    }

    const items = await WardrobeItem.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// Fungsi update dan delete item tidak perlu banyak berubah karena sudah berdasarkan ID item
export const updateWardrobeItem = async (req, res, next) => {
  try {
    let item = await WardrobeItem.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item tidak ditemukan." });
    }
    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Tidak diizinkan." });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(item.imagePublicId);
      const result = await streamUpload(req);
      item.imageUrl = result.secure_url;
      item.imagePublicId = result.public_id;
    }

    const { name, category, color, tags, notes } = req.body;
    if (name) item.name = name;
    if (category) item.category = category;
    if (color) item.color = color;
    if (notes) item.notes = notes;
    if (tags) {
      item.tags = tags.split(",").map((tag) => tag.trim());
    }

    const updatedItem = await item.save();
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    next(error);
  }
};

export const deleteWardrobeItem = async (req, res, next) => {
  try {
    const item = await WardrobeItem.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item tidak ditemukan." });
    }
    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Tidak diizinkan." });
    }

    await cloudinary.uploader.destroy(item.imagePublicId);
    await item.deleteOne();

    res.status(200).json({ success: true, message: "Item berhasil dihapus." });
  } catch (error) {
    next(error);
  }
};

// Fungsi get kategori tidak berubah
export const getWardrobeCategories = async (req, res, next) => {
  try {
    // Menggunakan schema dari WardrobeItem untuk mendapatkan enum
    const categories = WardrobeItem.schema.path("category").enumValues;
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

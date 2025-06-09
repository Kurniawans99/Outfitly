import WardrobeItem from "../models/wardrobe/wardrobeItem.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

export const createWardrobeItem = async (req, res, next) => {
  try {
    const { name, category, color, tags, notes } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Gambar pakaian harus diunggah." });
    }

    // Panggil helper function untuk upload ke Cloudinary
    const result = await streamUpload(req);

    // Buat item baru di database dengan URL dan public ID dari Cloudinary
    const newItem = await WardrobeItem.create({
      name,
      category,
      color,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      notes,
      user: req.user._id,
      imageUrl: result.secure_url, // Gunakan URL aman dari Cloudinary
      imagePublicId: result.public_id, // Gunakan public_id dari Cloudinary
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

export const getWardrobeItems = async (req, res, next) => {
  try {
    const { search, category, color } = req.query;
    let query = { user: req.user._id };

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

    // Jika ada file gambar baru diupload
    if (req.file) {
      // Hapus gambar lama dari Cloudinary
      await cloudinary.uploader.destroy(item.imagePublicId);

      // Upload gambar baru ke Cloudinary
      const result = await streamUpload(req);

      // Perbarui dengan URL dan public ID gambar baru
      item.imageUrl = result.secure_url;
      item.imagePublicId = result.public_id;
    }

    // Perbarui field lain dari req.body
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

    // Hapus gambar dari Cloudinary menggunakan public ID yang tersimpan
    await cloudinary.uploader.destroy(item.imagePublicId);

    // Hapus item dari database
    await item.deleteOne();

    res.status(200).json({ success: true, message: "Item berhasil dihapus." });
  } catch (error) {
    next(error);
  }
};

export const getWardrobeCategories = async (req, res, next) => {
  try {
    const categories = WardrobeItem.schema.path("category").enumValues;
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

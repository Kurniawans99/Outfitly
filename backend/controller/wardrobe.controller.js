import WardrobeItem from "../models/wardrobe/wardrobeItem.model.js";
import cloudinary from "../config/cloudinary.js";

export const createWardrobeItem = async (req, res, next) => {
  try {
    const { name, category, color, tags, notes } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Gambar pakaian harus diunggah." });
    }

    const newItem = await WardrobeItem.create({
      name,
      category,
      color,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      notes,
      user: req.user._id,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
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

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Filter functionality
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

    // Pastikan pengguna adalah pemilik item
    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Tidak diizinkan." });
    }

    // Jika ada file gambar baru diupload
    if (req.file) {
      // Hapus gambar lama dari Cloudinary
      await cloudinary.uploader.destroy(item.imagePublicId);
      // Perbarui dengan URL dan public ID gambar baru
      item.imageUrl = req.file.path;
      item.imagePublicId = req.file.filename;
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

    // Check if user owns the item
    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Tidak diizinkan." });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(item.imagePublicId);

    // Delete item from DB
    await item.deleteOne();

    res.status(200).json({ success: true, message: "Item berhasil dihapus." });
  } catch (error) {
    next(error);
  }
};

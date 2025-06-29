import mongoose from "mongoose";

const inspoItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama item harus diisi."],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Kategori harus dipilih."],
    enum: ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"],
  },
  brand: {
    type: String,
    trim: true,
    default: "Tidak ada brand",
  },
  imageUrl: {
    type: String,
    required: [true, "Gambar item harus ada."],
  },
  imagePublicId: {
    type: String,
    required: [true, "Public ID gambar item diperlukan."],
  },
});

export default inspoItemSchema;

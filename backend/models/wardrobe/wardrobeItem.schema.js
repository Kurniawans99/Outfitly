import mongoose from "mongoose";

const wardrobeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama pakaian harus diisi."],
      trim: true,
      maxLength: [100, "Nama pakaian tidak boleh lebih dari 100 karakter."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Kategori harus dipilih."],
      enum: ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"],
    },
    color: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Catatan tidak boleh lebih dari 500 karakter."],
    },
    imageUrl: {
      type: String,
      required: [true, "Gambar pakaian harus ada."],
    },
    imagePublicId: {
      type: String,
      required: [true, "Public ID gambar diperlukan."],
    },
    lastWorn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk search text
wardrobeItemSchema.index({ name: "text", notes: "text" });

export default wardrobeItemSchema;

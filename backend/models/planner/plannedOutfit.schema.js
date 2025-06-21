import mongoose from "mongoose";

const plannedOutfitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Tanggal rencana outfit harus diisi."],
      index: true,
    },
    outfitName: {
      type: String,
      trim: true,
      maxLength: [100, "Nama outfit tidak boleh lebih dari 100 karakter."],
    },
    occasion: {
      type: String,
      trim: true,
      maxLength: [500, "Catatan acara tidak boleh lebih dari 500 karakter."],
    },
    // Referensi ke item-item yang membentuk outfit
    // Ini bisa berupa campuran WardrobeItem atau InspoItem
    items: [
      {
        itemType: {
          type: String,
          enum: ["WardrobeItem", "InspoItem"],
          required: true,
        },
        item: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "items.itemType", // Digunakan untuk Dynamic References
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Tambahkan index unik untuk mencegah dua outfit pada tanggal yang sama untuk user yang sama
plannedOutfitSchema.index({ user: 1, date: 1 }, { unique: true });

export default plannedOutfitSchema;

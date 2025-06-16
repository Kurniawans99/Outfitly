import mongoose from "mongoose";

const wardrobeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama lemari harus diisi."],
      trim: true,
      maxLength: [100, "Nama lemari tidak boleh lebih dari 100 karakter."],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Deskripsi tidak boleh lebih dari 500 karakter."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual untuk menghitung jumlah item di dalam lemari ini
wardrobeSchema.virtual("itemCount", {
  ref: "WardrobeItem",
  localField: "_id",
  foreignField: "wardrobe",
  count: true,
});

export default wardrobeSchema;

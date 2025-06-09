import mongoose from "mongoose";
import replySchema from "./reply.schema.js";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Judul postingan harus diisi."],
      trim: true,
      minLength: [5, "Judul minimal 5 karakter."],
      maxLength: [150, "Judul maksimal 150 karakter."],
    },
    content: {
      type: String,
      required: [true, "Isi postingan tidak boleh kosong."],
      trim: true,
      minLength: [10, "Isi postingan minimal 10 karakter."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [replySchema], // Menggunakan skema balasan sebagai sub-dokumen
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual untuk menghitung jumlah balasan dan suka
postSchema.virtual("replyCount").get(function () {
  return this.replies ? this.replies.length : 0;
});

postSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Index untuk pencarian teks
postSchema.index({ title: "text", content: "text", tags: "text" });

export default postSchema;

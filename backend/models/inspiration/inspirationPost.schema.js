import mongoose from "mongoose";
import commentSchema from "./comment.schema.js";
import inspoItemSchema from "./inspoItem.schema.js";

const inspirationPostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: [true, "Caption harus diisi."],
      trim: true,
      maxLength: [2200, "Caption maksimal 2200 karakter."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Gambar inspirasi harus ada."],
    },
    imagePublicId: {
      type: String,
      required: [true, "Public ID gambar diperlukan."],
    },

    items: [inspoItemSchema],

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
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

inspirationPostSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

inspirationPostSchema.virtual("saveCount").get(function () {
  return this.saves ? this.saves.length : 0;
});

inspirationPostSchema.virtual("commentCount").get(function () {
  return this.comments ? this.comments.length : 0;
});

inspirationPostSchema.index({ caption: "text", tags: "text" });

export default inspirationPostSchema;

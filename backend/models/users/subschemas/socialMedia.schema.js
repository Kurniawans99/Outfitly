import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema(
  {
    instagram: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^@?[a-zA-Z0-9_.]+$/.test(v);
        },
        message: "Invalid Instagram username format",
      },
    },
    twitter: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^@?[a-zA-Z0-9_]+$/.test(v);
        },
        message: "Invalid Twitter username format",
      },
    },
    tiktok: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^@?[a-zA-Z0-9_.]+$/.test(v);
        },
        message: "Invalid TikTok username format",
      },
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+\..+/.test(v);
        },
        message: "Invalid website URL format",
      },
    },
  },
  { _id: false }
);

export default socialMediaSchema;

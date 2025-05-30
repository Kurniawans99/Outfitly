import mongoose from "mongoose";

const stylePreferencesSchema = new mongoose.Schema(
  {
    tags: [
      {
        type: String,
        enum: [
          "casual",
          "formal",
          "vintage",
          "modern",
          "minimalist",
          "bohemian",
          "street-style",
          "elegant",
          "sporty",
          "edgy",
          "romantic",
          "preppy",
          "grunge",
          "classic",
          "trendy",
        ],
      },
    ],
    favoriteColors: [
      {
        type: String,
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          "Invalid color hex format",
        ],
      },
    ],
    sizes: {
      tops: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", ""],
      },
      bottoms: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", ""],
      },
      shoes: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^\d{2}(\.\d)?$/.test(v); // Format: 36, 36.5, 42, etc
          },
          message: "Invalid shoe size format",
        },
      },
    },
  },
  { _id: false }
);

export default stylePreferencesSchema;

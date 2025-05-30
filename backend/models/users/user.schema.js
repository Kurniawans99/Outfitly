import mongoose from "mongoose";
import socialMediaSchema from "./subschemas/socialMedia.schema.js";
import stylePreferencesSchema from "./subschemas/stylePreference.schema.js";
import statsSchema from "./subschemas/stats.schema.js";

const userSchema = new mongoose.Schema(
  {
    // Basic Authentication Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
      index: true, // For faster queries
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
      index: true, // For faster queries
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include in queries by default
    },

    // Profile Information
    bio: {
      type: String,
      trim: true,
      maxLength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    avatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    coverPhoto: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    // Contact Information
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: "Invalid phone number format",
      },
    },
    location: {
      type: String,
      trim: true,
      maxLength: [100, "Location cannot exceed 100 characters"],
    },

    // Social Media & External Links
    socialMedia: socialMediaSchema,

    // Style & Fashion Preferences
    stylePreferences: stylePreferencesSchema,

    stats: statsSchema,

    // Activity Tracking
    lastLoginAt: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    // Relationships (References to other collections)
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes untuk optimasi query

userSchema.index({ "stats.followersCount": -1 });
userSchema.index({ "stats.totalOutfits": -1 });
userSchema.index({ lastActiveAt: -1 });
userSchema.index({ createdAt: -1 });

export default userSchema;

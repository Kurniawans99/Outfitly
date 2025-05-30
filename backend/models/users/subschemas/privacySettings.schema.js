import mongoose from "mongoose";

const privacySettingsSchema = new mongoose.Schema(
  {
    profileVisibility: {
      type: String,
      enum: ["public", "followers-only", "private"],
      default: "public",
    },
    allowFollowRequests: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    showPhone: {
      type: Boolean,
      default: false,
    },
    allowMessaging: {
      type: String,
      enum: ["everyone", "followers-only", "none"],
      default: "followers-only",
    },
  },
  { _id: false }
);

export default privacySettingsSchema;

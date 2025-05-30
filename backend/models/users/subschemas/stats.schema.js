import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    totalOutfits: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

export default statsSchema;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "required Name"],
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      type: String,
      required: [true, "required Email"],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: [true, "required Password"],
      minLength: 6,
    },
  },
  { Timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

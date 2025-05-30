import mongoose from "mongoose";
import User from "../models/users/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password, username } = req.body;

    // Check if user exists (bisa juga menggunakan static method jika ada)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).session(session);
    if (existingUser) {
      const error = new Error(
        "User with this email or username already exists"
      );
      error.statusCode = 409;
      throw error;
    }

    const newUserInstance = new User({
      name,
      email,
      password,
      username /* field lain */,
    });
    const newUsers = await newUserInstance.save({ session });

    const token = jwt.sign(
      { userId: newUsers._id, email: newUsers.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    await session.commitTransaction();
    session.endSession();

    const userResponse = { ...newUsers.toObject() };

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // Pastikan error yang dilempar oleh validasi Mongoose juga ditangani dengan baik
    if (error.name === "ValidationError") {
      error.statusCode = 400; // atau 422
    }
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Email not found");
      error.statusCode = 401;
      throw error;
    }

    // Gunakan method instance comparePassword
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // await user.incLoginAttempts(); // Panggil jika ingin implementasi lock akun
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    // await user.resetLoginAttempts(); // Reset jika login berhasil & ada implementasi lock

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Kirim user.displayName atau user.toObject() tanpa password
    const userResponse = user.toObject();
    delete userResponse.password; // Pastikan password tidak terkirim

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

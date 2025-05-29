import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Validasi panjang password manual
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      error.statusCode = 400;
      throw error;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Biarkan Mongoose melakukan validasi lainnya
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign(
      { userId: newUsers[0]._id, email: newUsers[0].email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    await session.commitTransaction();
    session.endSession();

    // Hapus password dari response
    const userResponse = { ...newUsers[0].toObject() };
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Email Is not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

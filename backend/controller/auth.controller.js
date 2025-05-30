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
      username,
      email,
      password,
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
    const { identifier, password } = req.body;

    // Validasi input dasar
    if (!identifier || !password) {
      const error = new Error("Please enter your email/username and password.");
      error.statusCode = 400;
      throw error;
    }

    const lowercasedIdentifier = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: lowercasedIdentifier },
        { username: lowercasedIdentifier },
      ],
    }).select("+password");

    if (!user) {
      const error = new Error("Email or username not found.");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      const error = new Error("Wrong Password.");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login success.",
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

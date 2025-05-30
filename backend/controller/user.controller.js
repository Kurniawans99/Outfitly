import User from "../models/users/User.model.js";
import mongoose from "mongoose";

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userProfileData = {
      _id: user._id,
      name: user.displayName,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      avatar: user.avatar, // { url, publicId }
      coverPhoto: user.coverPhoto, // { url, publicId }
      joinDate: user.createdAt,
      socialMedia: {
        instagram: user.socialMedia?.instagram || "",
        twitter: user.socialMedia?.twitter || "",
        tiktok: user.socialMedia?.tiktok || "",
        website: user.socialMedia?.website || "",
      },
      stylePreferences: user.stylePreferences,
      stats: {
        outfits: user.stats?.totalOutfits || 0,
        followers: user.stats?.followersCount || 0,
        following: user.stats?.followingCount || 0,
        likes: user.stats?.totalLikes || 0,
      },
    };

    res.status(200).json({
      success: true,
      user: userProfileData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const {
      name,
      phone,
      email,
      location,
      bio,
      // avatar, coverPhoto (upload gambar biasanya endpoint terpisah)
      socialMedia,
    } = req.body;

    // Update field dasar
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Tambahkan validasi jika email diubah (misal, cek keunikan, kirim email verifikasi)
      const existingUser = await User.findOne({ email });
      if (existingUser && !existingUser._id.equals(user._id)) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }
      user.email = email;
    }

    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;

    // Update social media (pastikan socialMedia ada di skema dan diinisialisasi)
    if (socialMedia) {
      if (!user.socialMedia) user.socialMedia = {};
      if (socialMedia.instagram !== undefined)
        user.socialMedia.instagram = socialMedia.instagram;
      if (socialMedia.twitter !== undefined)
        user.socialMedia.twitter = socialMedia.twitter;
      if (socialMedia.tiktok !== undefined)
        user.socialMedia.twitter = socialMedia.twitter;
      if (socialMedia.website !== undefined)
        user.socialMedia.website = socialMedia.website;
    }

    const updatedUser = await user.save();

    const userProfileData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      location: updatedUser.location || "",
      bio: updatedUser.bio || "",
      avatar: updatedUser.avatar,
      coverPhoto: updatedUser.coverPhoto,
      joinDate: updatedUser.createdAt,
      socialMedia: {
        instagram: updatedUser.socialMedia?.instagram || "",
        twitter: updatedUser.socialMedia?.twitter || "",
        tiktok: updatedUser.socialMedia?.tiktok || "",
        website: updatedUser.socialMedia?.website || "",
      },
      stats: {
        outfits: updatedUser.stats?.totalOutfits || 0,
        followers: updatedUser.stats?.followersCount || 0,
        following: updatedUser.stats?.followingCount || 0,
        likes: updatedUser.stats?.totalLikes || 0,
      },
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userProfileData,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.statusCode = 400;
    }
    next(error);
  }
};

export const getUserProfileByIdOrUsername = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let user;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    }

    // Jika tidak ditemukan dengan ID atau bukan ObjectId, coba cari dengan username
    if (!user) {
      //mencari dengan username
      user = await User.findOne({ username: identifier.toLowerCase() });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userToFollow = await User.findById(req.params.id).session(session);
    const currentUser = await User.findById(req.user._id).session(session);

    if (!userToFollow || !currentUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (userToFollow._id.equals(currentUser._id)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    }

    // Cek apakah sudah follow
    if (currentUser.following.includes(userToFollow._id)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Already following this user" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    // Update stats count
    currentUser.stats.followingCount = currentUser.following.length;
    userToFollow.stats.followersCount = userToFollow.followers.length;

    await currentUser.save({ session });
    await userToFollow.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Successfully followed ${userToFollow.displayName}`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userToUnfollow = await User.findById(req.params.id).session(session);
    const currentUser = await User.findById(req.user._id).session(session);

    if (!userToUnfollow || !currentUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Cek apakah memang sedang follow
    if (!currentUser.following.includes(userToUnfollow._id)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userToUnfollow._id)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(currentUser._id)
    );

    // Update stats count
    currentUser.stats.followingCount = currentUser.following.length;
    userToUnfollow.stats.followersCount = userToUnfollow.followers.length;

    await currentUser.save({ session });
    await userToUnfollow.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Successfully unfollowed ${userToUnfollow.displayName}`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let user;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier).populate(
        "followers",
        "name username avatar"
      );
    } else {
      user = await User.findOne({
        username: identifier.toLowerCase(),
      }).populate("followers", "name username avatar");
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      count: user.followers.length,
      followers: user.followers,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let user;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier).populate(
        "following",
        "name username avatar"
      );
    } else {
      user = await User.findOne({
        username: identifier.toLowerCase(),
      }).populate("following", "name username avatar");
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      count: user.following.length,
      following: user.following,
    });
  } catch (error) {
    next(error);
  }
};

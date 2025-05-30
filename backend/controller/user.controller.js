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

    // Pastikan user sudah mengupdate stats sebelum mengirim profil
    await user.updateStats();

    const userProfileData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || "", // Pastikan ada nilai default jika null/undefined
      location: user.location || "",
      bio: user.bio || "",
      avatar: user.avatar, // { url, publicId }
      coverPhoto: user.coverPhoto, // { url, publicId }
      joinDate: user.createdAt, // Frontend bisa memformat ini
      socialMedia: {
        instagram: user.socialMedia?.instagram || "",
        twitter: user.socialMedia?.twitter || "",
        tiktok: user.socialMedia?.tiktok || "", // Tambahkan jika ada di frontend
        website: user.socialMedia?.website || "",
      },
      stylePreferences: user.stylePreferences, // Jika dibutuhkan di profil
      privacySettings: user.privacySettings, // Jika dibutuhkan
      stats: {
        // Pastikan objek stats ada dan memiliki field yang diharapkan
        outfits: user.stats?.totalOutfits || 0,
        followers: user.stats?.followersCount || 0,
        following: user.stats?.followingCount || 0,
        likes: user.stats?.totalLikes || 0, // totalLikes dari user.stats
        // views: user.stats?.totalViews || 0, // Jika ada
        // avgLikesPerOutfit: user.stats?.avgLikesPerOutfit || 0, // Jika ada
      },
      // Anda juga bisa mengirim virtuals jika toJSON/toObject sudah dikonfigurasi
      // displayName: user.displayName,
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
      username,
      email,
      phone,
      location,
      bio,
      // avatar, coverPhoto (upload gambar biasanya endpoint terpisah)
      socialMedia,
    } = req.body;

    // Update field dasar
    if (name) user.name = name;
    if (username && username !== user.username) {
      // Tambahkan validasi jika username diubah (misal, cek keunikan)
      const existingUser = await User.findOne({ username });
      if (existingUser && !existingUser._id.equals(user._id)) {
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });
      }
      user.username = username;
    }
    if (email && email !== user.email) {
      // Tambahkan validasi jika email diubah (misal, cek keunikan, kirim email verifikasi)
      const existingUser = await User.findOne({ email });
      if (existingUser && !existingUser._id.equals(user._id)) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }
      user.email = email;
      user.emailVerified = false; // Set email jadi tidak terverifikasi jika diubah
    }

    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;

    // Update social media (pastikan socialMedia ada di skema dan diinisialisasi)
    if (socialMedia) {
      if (!user.socialMedia) user.socialMedia = {}; // Inisialisasi jika belum ada
      if (socialMedia.instagram !== undefined)
        user.socialMedia.instagram = socialMedia.instagram;
      if (socialMedia.twitter !== undefined)
        user.socialMedia.twitter = socialMedia.twitter;
      if (socialMedia.website !== undefined)
        user.socialMedia.website = socialMedia.website;
      // tambahkan field social media lain jika ada
    }

    // Untuk avatar dan coverPhoto, idealnya dihandle oleh endpoint upload terpisah
    // yang mengembalikan URL gambar, lalu URL itu disimpan di sini.
    // Jika Anda mengirim URL langsung:
    // if (req.body.avatarUrl) user.avatar.url = req.body.avatarUrl;
    // if (req.body.coverPhotoUrl) user.coverPhoto.url = req.body.coverPhotoUrl;

    const updatedUser = await user.save(); // Mongoose akan menjalankan validasi

    // Kembalikan data yang sudah diupdate (mirip dengan getMyProfile)
    const userProfileData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
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

    // Cek apakah identifier adalah ObjectId yang valid
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    }

    // Jika tidak ditemukan dengan ID atau bukan ObjectId, coba cari dengan username
    if (!user) {
      // Gunakan static method jika ada dan sesuai, atau query langsung
      // user = await User.findByEmailOrUsername(identifier); // Ini mencari email atau username
      // Jika identifier hanya untuk username:
      user = await User.findOne({ username: identifier.toLowerCase() });
    }

    if (!user || !user.isActive) {
      // Mungkin Anda ingin menyembunyikan user yang tidak aktif
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Logika untuk profileVisibility (jika bukan pemilik profil)
    // const isOwner = req.user && req.user._id.equals(user._id);
    // if (!isOwner && user.privacySettings.profileVisibility === 'private') {
    //   return res.status(403).json({ success: false, message: "This profile is private." });
    // }
    // if (!isOwner && user.privacySettings.profileVisibility === 'followers-only' && !user.followers.includes(req.user._id)) {
    //   return res.status(403).json({ success: false, message: "This profile is only visible to followers." });
    // }

    // Sesuaikan data yang dikembalikan berdasarkan privacy settings
    const userResponse = user.toObject(); // atau .toJSON() untuk virtuals
    delete userResponse.password;
    // Hapus/filter field lain berdasarkan privacySettings jika perlu (misal: email, phone)

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
    const currentUser = await User.findById(req.user._id).session(session); // req.user dari middleware

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

    // Kirim notifikasi (jika ada sistem notifikasi)

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

    // Pertimbangkan privacy settings di sini

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

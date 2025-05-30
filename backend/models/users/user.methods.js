import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * @param {mongoose.Schema} userSchema
 */
export default function applyUserMethods(userSchema) {
  userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      if (!this.password) {
        throw new Error("Password not set for this user.");
      }
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      console.error("Password comparison error:", error);
      throw new Error("Password comparison failed");
    }
  };

  userSchema.methods.incLoginAttempts = function () {
    // Reset attempts if lock has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.updateOne({
        $unset: { lockUntil: 1 },
        $set: { loginAttempts: 1 },
      });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    // Lock account after 5 failed attempts for 2 hours
    // Pastikan loginAttempts diinisialisasi jika belum ada
    const currentAttempts = this.loginAttempts || 0;
    if (currentAttempts + 1 >= 5 && !this.isLocked) {
      updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }

    return this.updateOne(updates);
  };

  // Method untuk reset login attempts
  userSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
      $set: { loginAttempts: 0 }, // Set ke 0 daripada $unset
      $unset: { lockUntil: 1 },
    });
  };

  // Method untuk update stats
  userSchema.methods.updateStats = async function () {
    // Dinamis import atau pastikan Outfit model sudah terdaftar sebelum method ini dipanggil
    const Outfit = mongoose.model("Outfit"); // Asumsi Anda memiliki Outfit model

    try {
      const statsAggregation = await Outfit.aggregate([
        { $match: { userId: this._id } },
        {
          $group: {
            _id: null,
            totalOutfits: { $sum: 1 },
            totalLikes: { $sum: { $ifNull: ["$likesCount", 0] } }, // Handle null likesCount
            totalViews: { $sum: { $ifNull: ["$viewsCount", 0] } }, // Handle null viewsCount
            avgLikes: { $avg: "$likesCount" },
          },
        },
      ]);

      const newStats = {
        totalOutfits: 0,
        totalLikes: 0,
        totalViews: 0,
        avgLikesPerOutfit: 0,
        followersCount: this.followers ? this.followers.length : 0,
        followingCount: this.following ? this.following.length : 0,
        ...this.stats, // Pertahankan stats yang ada jika ada
      };

      if (statsAggregation.length > 0) {
        const aggResult = statsAggregation[0];
        newStats.totalOutfits = aggResult.totalOutfits;
        newStats.totalLikes = aggResult.totalLikes;
        newStats.totalViews = aggResult.totalViews;
        newStats.avgLikesPerOutfit = Math.round(aggResult.avgLikes || 0);
      }

      this.stats = newStats;
      await this.save();
    } catch (error) {
      console.error("Error updating user stats:", error);
      // Handle error jika perlu, misalnya dengan melemparnya lagi atau mencatatnya
    }
  };
}

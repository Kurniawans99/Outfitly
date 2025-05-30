/**
 * @param {mongoose.Schema} userSchema
 */
export default function applyUserStatics(userSchema) {
  // Static method untuk mencari user dengan berbagai kriteria
  userSchema.statics.findByEmailOrUsername = function (identifier) {
    const lowerIdentifier = identifier.toLowerCase();
    return this.findOne({
      $or: [{ email: lowerIdentifier }, { username: lowerIdentifier }],
    });
  };

  // Static method untuk popular users
  userSchema.statics.findPopularUsers = function (limit = 10) {
    return this.find({ isActive: true })
      .sort({ "stats.followersCount": -1, "stats.totalLikes": -1 })
      .limit(limit)
      .select("name username avatar stats");
  };
}

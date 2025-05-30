/**
 * @param {mongoose.Schema} userSchema
 */
export default function applyUserVirtuals(userSchema) {
  // Virtual untuk full display name
  userSchema.virtual("displayName").get(function () {
    return this.name || this.username;
  });

  // Virtual untuk follower/following ratio
  userSchema.virtual("engagementRatio").get(function () {
    if (!this.stats || this.stats.followersCount === 0) return "0.00"; // Berikan nilai default jika stats tidak ada
    return (this.stats.totalLikes / this.stats.followersCount).toFixed(2);
  });
}

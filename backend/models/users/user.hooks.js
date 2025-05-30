import bcrypt from "bcryptjs";

/**
 * @param {mongoose.Schema} userSchema
 */
export default function applyUserHooks(userSchema) {
  // Pre-save middleware untuk hash password
  userSchema.pre("save", async function (next) {
    // Only hash password if it's modified
    if (!this.isModified("password")) return next();

    try {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  // Pre-save middleware untuk update lastActiveAt
  userSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("lastLoginAt")) {
      this.lastActiveAt = new Date();
    }
    next();
  });
}

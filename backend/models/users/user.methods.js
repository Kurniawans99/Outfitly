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
}

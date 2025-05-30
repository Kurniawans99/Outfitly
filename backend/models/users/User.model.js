import mongoose from "mongoose";
import userSchema from "./user.schema.js";
import applyUserVirtuals from "./user.virtuals.js";
import applyUserHooks from "./user.hooks.js";
import applyUserMethods from "./user.methods.js";
import applyUserStatics from "./user.statics.js";

// Terapkan virtuals, hooks, methods, dan statics ke skema
applyUserVirtuals(userSchema);
applyUserHooks(userSchema);
applyUserMethods(userSchema);
applyUserStatics(userSchema);

const User = mongoose.model("User", userSchema);

export default User;

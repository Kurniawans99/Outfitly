import mongoose from "mongoose";
import inspoItemSchema from "./inspoItem.schema.js";

// Register the InspoItem schema as a Mongoose model
const InspoItemModel = mongoose.model("InspoItem", inspoItemSchema);

export default InspoItemModel;

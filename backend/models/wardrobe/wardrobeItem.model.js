import mongoose from "mongoose";
import wardrobeItemSchema from "./wardrobeItem.schema.js";

const WardrobeItem = mongoose.model("WardrobeItem", wardrobeItemSchema);

export default WardrobeItem;

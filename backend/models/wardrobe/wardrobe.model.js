import mongoose from "mongoose";
import wardrobeSchema from "./wardrobe.schema.js";

const Wardrobe = mongoose.model("Wardrobe", wardrobeSchema);

export default Wardrobe;

import mongoose from "mongoose";
import plannedOutfitSchema from "./plannedOutfit.schema.js";

const PlannedOutfit = mongoose.model("PlannedOutfit", plannedOutfitSchema);

export default PlannedOutfit;

import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  planOutfit,
  getPlannedOutfits,
  deletePlannedOutfit,
} from "../controller/planner.controller.js";

const plannerRouter = Router();

plannerRouter.use(protect);

plannerRouter.route("/").post(planOutfit).get(getPlannedOutfits);
plannerRouter.route("/:id").delete(deletePlannedOutfit);

export default plannerRouter;

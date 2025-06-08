import { Router } from "express";
import { getStyleAdvice } from "../controller/gemini.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const geminiRouter = Router();

// Endpoint untuk mendapatkan saran fashion dari AI
// Menggunakan metode POST karena user mengirimkan data (prompt) di body
geminiRouter.post("/gemini", protect, getStyleAdvice);

export default geminiRouter;

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config/env.js";
import User from "../models/users/User.model.js";

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined in the environment variables."
  );
}

// Inisialisasi model Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const getStyleAdvice = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const userId = req.user._id;

    if (!prompt) {
      const error = new Error("Prompt is required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    let stylePreferencesInfo = "User has not specified any style preferences.";
    if (
      user &&
      user.stylePreferences &&
      user.stylePreferences.tags?.length > 0
    ) {
      stylePreferencesInfo = `The user likes the following styles: ${user.stylePreferences.tags.join(
        ", "
      )}.`;
    }

    const fullPrompt = `
      You are "Outfitly AI", a friendly and expert fashion stylist.
      Your goal is to provide helpful, positive, and inspiring fashion advice.
      Do not sound like a generic robot. Be encouraging and creative.
      
      User's Context:
      - User's Name: ${user.displayName}
      - Style Profile: ${stylePreferencesInfo}

      User's Question: "${prompt}"

      Based on the user's question and their style profile, provide a helpful and stylish recommendation.
      Structure your response in clear, easy-to-read paragraphs.
      If relevant, suggest specific types of clothing items.
    `;

    // --- Perubahan untuk Streaming ---
    const result = await model.generateContentStream(fullPrompt);

    // Set header untuk streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // Tulis setiap chunk ke response saat diterima
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText); // Mengirim chunk ke frontend
    }

    res.end(); // Menutup koneksi setelah semua chunk terkirim
  } catch (error) {
    console.error("Error getting style advice from Gemini:", error);
    if (!res.headersSent) {
      // Hanya kirim error jika belum ada response yang terkirim
      error.message = "Failed to get advice from AI service.";
      next(error);
    } else {
      // Jika stream sudah berjalan, cukup akhiri
      res.end();
    }
  }
};

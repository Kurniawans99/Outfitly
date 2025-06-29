import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectDB from "./databases/mongoDB.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import geminiRouter from "./routes/gemini.routes.js";
import wardrobeRouter from "./routes/wardrobe.routes.js";
import communityRouter from "./routes/community.routes.js";
import inspirationRouter from "./routes/inspiration.routes.js";
import plannerRouter from "./routes/planner.routes.js";

const app = express();
const port = PORT || 5000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/ask", geminiRouter);
app.use("/api/wardrobe", wardrobeRouter);
app.use("/api/community", communityRouter);
app.use("/api/inspiration", inspirationRouter);
app.use("/api/planner", plannerRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Server is running on port: http://localhost:${port}`);

  await connectDB();
});

export default app;

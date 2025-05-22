import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectDB from "./databases/mongoDB.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const port = PORT || 5000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
authRouter.use("/api/auth", authRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Server is running on port: http://localhost:${port}`);

  await connectDB();
});

export default app;

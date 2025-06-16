import mongoose from "mongoose";
import inspirationPostSchema from "./inspirationPost.schema.js";

const InspirationPost = mongoose.model(
  "InspirationPost",
  inspirationPostSchema
);

export default InspirationPost;

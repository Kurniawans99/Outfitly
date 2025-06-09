import mongoose from "mongoose";
import postSchema from "./post.schema.js";

const Post = mongoose.model("Post", postSchema);

export default Post;

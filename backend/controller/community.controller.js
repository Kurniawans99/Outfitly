import Post from "../models/community/Post.model.js";
export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user._id;

    const post = await Post.create({
      title,
      content,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "name username avatar")
      .populate("replies.author", "name username avatar");

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const addReplyToPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const author = req.user._id;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan" });
    }

    post.replies.push({ content, author });
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name username avatar")
      .populate("replies.author", "name username avatar");

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.user._id;

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan" });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(req.params.postId)
      .populate("author", "name username avatar")
      .populate("replies.author", "name username avatar");

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeReply = async (req, res, next) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan" });
    }

    const reply = post.replies.id(replyId);

    if (!reply) {
      return res
        .status(404)
        .json({ success: false, message: "Balasan tidak ditemukan" });
    }

    const likeIndex = reply.likes.indexOf(userId);

    if (likeIndex > -1) {
      reply.likes.splice(likeIndex, 1);
    } else {
      reply.likes.push(userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "name username avatar")
      .populate("replies.author", "name username avatar");

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    next(error);
  }
};

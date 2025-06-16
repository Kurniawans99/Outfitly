import InspirationPost from "../models/inspiration/inspirationPost.model.js";
import User from "../models/users/User.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const streamUpload = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
// @desc    Buat postingan inspirasi baru
// @route   POST /api/inspiration
// @access  Private
export const createInspirationPost = async (req, res, next) => {
  try {
    const { caption, tags, items: itemsJsonString } = req.body;

    // Pisahkan file gambar utama dan file gambar item
    const mainImage = req.files.find((f) => f.fieldname === "mainImage");
    const itemImages = req.files.filter((f) => f.fieldname === "itemImages");

    if (!mainImage) {
      return res.status(400).json({
        success: false,
        message: "Gambar utama inspirasi harus diunggah.",
      });
    }

    // Upload gambar utama
    const mainImageResult = await streamUpload(
      mainImage.buffer,
      "inspirations"
    );

    // Proses item dinamis
    const itemsData = JSON.parse(itemsJsonString || "[]");
    const processedItems = [];

    // Pastikan jumlah data item dan gambar item cocok
    if (itemsData.length !== itemImages.length) {
      return res.status(400).json({
        success: false,
        message: "Jumlah data item dan gambar item tidak cocok.",
      });
    }

    for (let i = 0; i < itemsData.length; i++) {
      const itemDetail = itemsData[i];
      const itemImage = itemImages[i];

      // Upload setiap gambar item
      const itemImageResult = await streamUpload(
        itemImage.buffer,
        "inspiration-items"
      );

      processedItems.push({
        ...itemDetail,
        imageUrl: itemImageResult.secure_url,
        imagePublicId: itemImageResult.public_id,
      });
    }

    // Buat post baru di database
    const newPost = await InspirationPost.create({
      caption,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: req.user._id,
      imageUrl: mainImageResult.secure_url,
      imagePublicId: mainImageResult.public_id,
      items: processedItems, // Simpan array item yang sudah diproses
    });

    const populatedPost = await InspirationPost.findById(newPost._id).populate(
      "author",
      "name username avatar"
    );

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Dapatkan semua postingan inspirasi dengan filter & sort
// @route   GET /api/inspiration
// @access  Public
export const getAllInspirationPosts = async (req, res, next) => {
  try {
    const { search, tags, sort } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    let sortOptions = { createdAt: -1 }; // Default: terbaru
    if (sort === "popular") {
      sortOptions = { "likes.length": -1, createdAt: -1 }; // Ini tidak efisien, lebih baik update likeCount di model
    }

    const posts = await InspirationPost.find(query)
      .populate("author", "name username avatar")
      .populate("items", "name category imageUrl")
      .sort(sortOptions)
      .limit(50); // Tambahkan limit untuk performa

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Dapatkan detail satu postingan inspirasi
// @route   GET /api/inspiration/:id
// @access  Public
export const getInspirationPostById = async (req, res, next) => {
  try {
    const post = await InspirationPost.findById(req.params.id)
      .populate("author", "name username avatar")
      .populate("items", "name category imageUrl")
      .populate("comments.author", "name username avatar");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Postingan inspirasi tidak ditemukan.",
      });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike sebuah postingan inspirasi
// @route   POST /api/inspiration/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const post = await InspirationPost.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan." });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();

    const populatedPost = await InspirationPost.findById(post._id)
      .populate("author", "name username avatar")
      .populate("comments.author", "name username avatar");

    res.status(200).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Save / Unsave sebuah postingan inspirasi
// @route   POST /api/inspiration/:id/save
// @access  Private
export const toggleSave = async (req, res, next) => {
  try {
    const post = await InspirationPost.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan." });
    }

    const saveIndex = post.saves.indexOf(userId);

    if (saveIndex > -1) {
      post.saves.splice(saveIndex, 1); // Unsave
    } else {
      post.saves.push(userId); // Save
    }

    await post.save();

    const populatedPost = await InspirationPost.findById(post._id)
      .populate("author", "name username avatar")
      .populate("comments.author", "name username avatar");

    res.status(200).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Tambah komentar ke postingan
// @route   POST /api/inspiration/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await InspirationPost.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Postingan tidak ditemukan." });
    }

    // Tambahkan komentar baru (author masih berupa ID)
    post.comments.push({ content, author: req.user._id });

    // Simpan perubahan ke database
    await post.save();

    await post.populate({
      path: "comments.author",
      select: "name username avatar",
    });

    // Populate author dari post utama juga untuk konsistensi
    await post.populate({
      path: "author",
      select: "name username avatar",
    });

    // Kirim kembali 'post' yang sekarang sudah ter-populate sepenuhnya
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

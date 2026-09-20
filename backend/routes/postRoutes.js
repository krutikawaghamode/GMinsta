const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

const router = express.Router();


// IMAGE UPLOAD SETUP
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }

});

const upload = multer({ storage: storage });


// CREATE POST
router.post("/create", upload.single("image"), async (req, res) => {

    try {

        const { username, content } = req.body;

        const post = new Post({

            username: username,

            content: content || "",

            image: req.file
                ? `/uploads/${req.file.filename}`
                : ""

        });

        await post.save();

        res.status(201).json({

            message: "Post created successfully",

            post: post

        });

    } catch (error) {

        res.status(500).json({

            message: "Post creation failed",

            error: error.message

        });

    }

});


// GET ALL POSTS
router.get("/", async (req, res) => {

    try {

        const posts = await Post.find()
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {

        res.status(500).json({

            message: "Failed to fetch posts",

            error: error.message

        });

    }

});


// LIKE POST
router.put("/like/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({

                message: "Post not found"

            });

        }

        post.likes += 1;

        await post.save();

        res.json({

            message: "Post liked",

            likes: post.likes

        });

    } catch (error) {

        res.status(500).json({

            message: "Like failed",

            error: error.message

        });

    }

});


// ADD COMMENT
router.put("/comment/:id", async (req, res) => {

    try {

        const { username, text } = req.body;

        if (!text || !text.trim()) {

            return res.status(400).json({

                message: "Comment cannot be empty"

            });

        }

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({

                message: "Post not found"

            });

        }

        if (!post.comments) {

            post.comments = [];

        }

        post.comments.push({

            username: username || "krutika01",

            text: text.trim()

        });

        await post.save();

        res.json({

            message: "Comment added successfully",

            comments: post.comments

        });

    } catch (error) {

        console.log("COMMENT ERROR:", error);

        res.status(500).json({

            message: "Comment failed",

            error: error.message

        });

    }

});


// DELETE POST
router.delete("/:id", async (req, res) => {

    try {

        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {

            return res.status(404).json({

                message: "Post not found"

            });

        }

        res.json({

            message: "Post deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Delete failed",

            error: error.message

        });

    }

});


module.exports = router;
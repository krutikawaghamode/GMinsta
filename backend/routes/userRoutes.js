const express = require("express");
const User = require("../models/User");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {
    try {

        const { username, email, password } = req.body;

        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email,
            password
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        res.json({
            message: "Login successful",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }
});


// =========================
// FOLLOW / UNFOLLOW
// =========================

router.put("/follow/:userId", async (req, res) => {
    try {

        const { currentUsername } = req.body;

        const targetUsername = req.params.userId;

        const currentUser = await User.findOne({
            username: currentUsername
        });

        const targetUser = await User.findOne({
            username: targetUsername
        });

        if (!currentUser || !targetUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        if (currentUser._id.equals(targetUser._id)) {

            return res.status(400).json({
                message: "You cannot follow yourself"
            });

        }

        const alreadyFollowing =
            currentUser.following.some(
                id => id.equals(targetUser._id)
            );

        if (alreadyFollowing) {

            currentUser.following.pull(targetUser._id);

            targetUser.followers.pull(currentUser._id);

        } else {

            currentUser.following.push(targetUser._id);

            targetUser.followers.push(currentUser._id);

        }

        await currentUser.save();

        await targetUser.save();

        res.json({

            message: alreadyFollowing
                ? "Unfollowed successfully"
                : "Followed successfully",

            followingCount:
                currentUser.following.length

        });

    } catch (error) {

        console.error("Follow error:", error);

        res.status(500).json({

            message: "Follow action failed",

            error: error.message

        });

    }
});


module.exports = router;

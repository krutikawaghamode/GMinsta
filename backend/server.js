const dns = require("dns");
dns.setServers(["1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.get("/api/posts", (req, res) => {
    res.json([]);
});
app.get("/", (req, res) => {
    res.send("GMinsta Backend is Running 🚀");
});
app.get("/test", (req, res) => {
    res.send("SERVER TEST WORKING 🔥");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully ✅");

        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

dotenv.config();

// Connect Database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("SB Stocks API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
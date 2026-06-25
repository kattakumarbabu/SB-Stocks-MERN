const Watchlist = require("../models/Watchlist");

// Add to Watchlist
const addToWatchlist = async (req, res) => {
    try {

        const { userId, stockId } = req.body;

        const exists = await Watchlist.findOne({
            user: userId,
            stock: stockId
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Stock already in watchlist"
            });
        }

        const watchlist = await Watchlist.create({
            user: userId,
            stock: stockId
        });

        res.status(201).json({
            success: true,
            message: "Added to Watchlist",
            watchlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Watchlist
const getWatchlist = async (req, res) => {
    try {

        const { userId } = req.params;

        const watchlist = await Watchlist.find({
            user: userId
        }).populate("stock");

        res.status(200).json({
            success: true,
            count: watchlist.length,
            watchlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Remove from Watchlist
const removeFromWatchlist = async (req, res) => {
    try {

        const watchlist = await Watchlist.findById(req.params.id);

        if (!watchlist) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        await watchlist.deleteOne();

        res.status(200).json({
            success: true,
            message: "Removed from Watchlist"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist
};
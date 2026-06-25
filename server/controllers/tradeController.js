const User = require("../models/User");
const Stock = require("../models/Stock");
const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

const buyStock = async (req, res) => {
    try {

        const { userId, stockId, quantity } = req.body;

        // Find User
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find Stock
        const stock = await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        // Calculate Total Cost
        const totalAmount = stock.currentPrice * quantity;

        // Check Balance
        if (user.virtualBalance < totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient Balance"
            });
        }

        // Deduct Balance
        user.virtualBalance -= totalAmount;

        await user.save();

        // Check Portfolio
        let portfolio = await Portfolio.findOne({
            user: userId,
            stock: stockId
        });

        if (portfolio) {

            portfolio.quantity += quantity;

            portfolio.averagePrice = stock.currentPrice;

            await portfolio.save();

        } else {

            portfolio = await Portfolio.create({
                user: userId,
                stock: stockId,
                quantity,
                averagePrice: stock.currentPrice
            });

        }

        // Create Transaction
        await Transaction.create({
            user: userId,
            stock: stockId,
            type: "BUY",
            quantity,
            price: stock.currentPrice,
            totalAmount
        });

        res.status(200).json({
            success: true,
            message: "Stock Purchased Successfully",
            remainingBalance: user.virtualBalance,
            portfolio
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



const getPortfolio = async (req, res) => {
    try {

        const { userId } = req.params;

        const portfolio = await Portfolio.find({ user: userId })
            .populate("stock", "symbol companyName currentPrice sector");

        res.status(200).json({
            success: true,
            count: portfolio.length,
            portfolio
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const sellStock = async (req, res) => {
    try {

        const { userId, stockId, quantity } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const stock = await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        const portfolio = await Portfolio.findOne({
            user: userId,
            stock: stockId
        });

        if (!portfolio) {
            return res.status(400).json({
                success: false,
                message: "Stock not found in portfolio"
            });
        }

        if (portfolio.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough shares"
            });
        }

        // Calculate Amount
        const totalAmount = stock.currentPrice * quantity;

        // Add balance
        user.virtualBalance += totalAmount;

        await user.save();

        // Update portfolio
        portfolio.quantity -= quantity;

        if (portfolio.quantity === 0) {
            await Portfolio.findByIdAndDelete(portfolio._id);
        } else {
            await portfolio.save();
        }

        // Save transaction
        await Transaction.create({
            user: userId,
            stock: stockId,
            type: "SELL",
            quantity,
            price: stock.currentPrice,
            totalAmount
        });

        res.status(200).json({
            success: true,
            message: "Stock Sold Successfully",
            remainingBalance: user.virtualBalance
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getTransactions = async (req, res) => {
    try {

        const { userId } = req.params;

        const transactions = await Transaction.find({ user: userId })
            .populate("stock", "symbol companyName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    buyStock,
    sellStock,
    getPortfolio,
    getTransactions
};
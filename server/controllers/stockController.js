const Stock = require("../models/Stock");

// Add Stock
const addStock = async (req, res) => {
    try {

        const stock = await Stock.create(req.body);

        res.status(201).json({
            success: true,
            message: "Stock Added Successfully",
            stock
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Stocks
const getStocks = async (req, res) => {

    try {

        const stocks = await Stock.find();

        res.json({
            success: true,
            count: stocks.length,
            stocks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const searchStock = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        const stocks = await Stock.find({
            companyName: {
                $regex: keyword,
                $options: "i"
            }
        });

        res.json({
            success: true,
            count: stocks.length,
            stocks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateStock = async (req, res) => {

    try {

        const stock = await Stock.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Stock Updated Successfully",
            stock
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteStock = async (req, res) => {

    try {

        const stock = await Stock.findById(req.params.id);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        await stock.deleteOne();

        res.status(200).json({
            success: true,
            message: "Stock Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    addStock,
    getStocks,
    searchStock,
    updateStock,
    deleteStock
};
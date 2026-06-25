const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stock = require("../models/Stock");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const stocks = [
    {
        symbol: "AAPL",
        companyName: "Apple Inc",
        sector: "Technology",
        currentPrice: 210,
        marketCap: 3500000000000
    },
    {
        symbol: "TSLA",
        companyName: "Tesla",
        sector: "Automobile",
        currentPrice: 315,
        marketCap: 900000000000
    },
    {
        symbol: "NVDA",
        companyName: "NVIDIA",
        sector: "Technology",
        currentPrice: 170,
        marketCap: 4200000000000
    },
    {
        symbol: "MSFT",
        companyName: "Microsoft",
        sector: "Technology",
        currentPrice: 520,
        marketCap: 3900000000000
    },
    {
        symbol: "AMZN",
        companyName: "Amazon",
        sector: "E-Commerce",
        currentPrice: 225,
        marketCap: 2400000000000
    }
];

const seedData = async () => {
    try {

        await Stock.deleteMany();

        await Stock.insertMany(stocks);

        console.log("Stocks Seeded Successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);

    }
};

seedData();
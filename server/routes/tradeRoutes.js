const express = require("express");



const router = express.Router();

const {
    buyStock,
    sellStock,
    getPortfolio,
    getTransactions
} = require("../controllers/tradeController");

router.get("/transactions/:userId", getTransactions);

router.post("/buy", buyStock);

router.post("/sell", sellStock);

router.get("/portfolio/:userId", getPortfolio);

module.exports = router;
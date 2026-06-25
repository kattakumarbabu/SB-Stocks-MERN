const express = require("express");
const router = express.Router();

const {
    addStock,
    getStocks,
    searchStock,
    updateStock,
    deleteStock
} = require("../controllers/stockController");

router.put("/:id", updateStock);

router.delete("/:id", deleteStock);

router.get("/search", searchStock);

router.post("/", addStock);

router.get("/", getStocks);

module.exports = router;
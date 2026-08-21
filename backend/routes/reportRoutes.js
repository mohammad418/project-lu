const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.get("/summary", invoiceController.getSummaryReport);

module.exports = router;

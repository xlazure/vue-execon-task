// route.js
const express = require("express");
const router = express.Router();

// Import your endpoint-specific routes here
const columnsRoutes = require("./routes/columns");

// Use the imported routes
router.use("/columns", columnsRoutes);

module.exports = router;
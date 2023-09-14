// route.js
const express = require("express");
const router = express.Router();

const columnsRoutes = require("./routes/columns");

router.use("/columns", columnsRoutes);

module.exports = router;

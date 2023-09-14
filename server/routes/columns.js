// routes/columns.js
const express = require("express");
const router = express.Router();
const columnsController = require("../controllers/columnControllers");

router.get("/:tableName", columnsController.getTableByName);

router.post("/:tableName/single", columnsController.addDataToTable);

router.post("/counter", columnsController.setCounterToTable);

router.post("/replaceC", columnsController.addItemsToColumnC);

router.post("/:tableName/multiple", columnsController.addMultipleDataToTable);

router.put("/update/:tableName/:uuid", columnsController.updateColumn);

router.put(
  "/setActive/:tableName/:uuid",
  columnsController.setActiveItemInTable
);

router.delete("/", columnsController.deleteAllColumns);

router.delete("/:tableName/:uuid", columnsController.deleteColumn);

module.exports = router;

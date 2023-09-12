// routes/columns.js
const express = require("express");
const router = express.Router();
const columnsController = require("../controllers/columnControllers");

router.get("/:columnName", columnsController.getColumnsByName); 

router.post("/:columnName/single", columnsController.addDataToTable);

router.post("/:columnName/multiple", columnsController.addMultipleDataToTable);

router.put("/:columnName/:id", columnsController.updateColumn);

router.delete("/", columnsController.deleteAllColumns);

router.delete("/:columnName/:id", columnsController.deleteColumn);



module.exports = router;
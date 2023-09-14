const db = require("../db");

function createTableIfNotExists(tableName, callback) {
  const checkIfExistsQuery = `
    SELECT COUNT(*) AS count FROM columns_list WHERE columnName = ?
  `;

  db.get(checkIfExistsQuery, [tableName], (err, row) => {
    if (err) {
      return callback(err);
    }

    if (row.count === 0) {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          isChecked INTEGER
        )
      `;

      db.run(createTableQuery, (err) => {
        if (err) {
          return callback(err);
        }

        const insertColumnNameQuery = `
          INSERT INTO columns_list (columnName) VALUES (?)
        `;

        db.run(insertColumnNameQuery, [tableName], (err) => {
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      });
    } else {
      callback(null);
    }
  });
}

exports.setCounterToTable = (req, res) => {
  const { counter } = req.body;
  const counterValue = Number(counter);
  if (isNaN(counterValue) || !Number.isInteger(counterValue)) {
    return res.status(400).json({
      error: "Invalid counter value. Please provide a valid integer.",
    });
  }

  db.run("DELETE FROM counter", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the counter." });
    }
  });

  const insertItemsQuery = `
    INSERT INTO counter (value) VALUES (?)
  `;

  db.run(insertItemsQuery, [counterValue], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while updating the counter." });
    }

    res.json({ message: "Counter table successfully updated!" });
  });
};

exports.deleteAllColumns = (req, res) => {
  const selectColumnNamesQuery = `
    SELECT columnName FROM columns_list
  `;

  db.all(selectColumnNamesQuery, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    rows;
    rows.forEach((row) => {
      const tableName = row.columnName;

      db.run(`DELETE FROM ${tableName}`, [], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    });

    res.json({ message: "All columns deleted successfully" });
  });
};

exports.getTableByName = (req, res) => {
  const tableName = req.params.tableName;
  createTableIfNotExists(tableName, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const selectQuery = `SELECT * FROM ${tableName}`;
    db.all(selectQuery, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
};

exports.addDataToTable = (req, res) => {
  const tableName = req.params.tableName;
  const { name, isChecked, isActive, uuid } = req.body;
  const insertQuery = `
    INSERT INTO ${tableName} (name,${isChecked === false ? "isChecked," : ""}${
    isActive === false ? "isActive," : ""
  } uuid)
    VALUES (?,${isChecked === false ? "?," : ""}${
    isActive === false ? "?," : ""
  }?)
  `;

  db.run(
    insertQuery,
    [name, isChecked ? 1 : isActive ? 1 : 0, uuid],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ id: this.lastID });
    }
  );
};

exports.addMultipleDataToTable = (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;

  const uniqueNames = new Set();

  data.forEach((item, index) => {
    const { name, isChecked, uuid } = item;

    const insertQuery = `
    INSERT INTO ${tableName} (name,${
      isChecked !== null ? "isChecked," : ""
    } uuid)
    VALUES (?,${isChecked !== null ? "?," : ""} ?)
  `;

    if (!uniqueNames.has(name)) {
      db.run(insertQuery, [name, isChecked ? 1 : 0, uuid], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        uniqueNames.add(name);

        if (uniqueNames.size === data.length) {
          res.json({ message: "Data inserted successfully" });
        }
      });
    }
  });
};

exports.updateColumn = (req, res) => {
  const tableName = req.params.tableName;
  const { uuid } = req.params;
  const { name, isChecked } = req.body;

  const updateQuery = `
    UPDATE ${tableName}
    SET name = ?, isChecked = ?
    WHERE uuid = ?
  `;
  db.run(updateQuery, [name, isChecked ? 1 : 0, uuid], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Record updated successfully" });
  });
};

exports.deleteColumn = (req, res) => {
  const tableName = req.params.tableName;
  const { uuid } = req.params;

  const deleteQuery = `
    DELETE FROM ${tableName}
    WHERE uuid = ?
  `;

  db.run(deleteQuery, [uuid], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Record deleted successfully" });
  });
};

exports.addItemsToColumnC = (req, res) => {
  const newDataForColumnC = req.body;

  if (!Array.isArray(newDataForColumnC)) {
    return res
      .status(400)
      .json({ error: "Invalid input data. Expected an array of objects." });
  }

  const valuesToInsert = [];

  for (const item of newDataForColumnC) {
    if (item && typeof item === "object" && "name" in item && "uuid" in item) {
      const { name, uuid } = item;
      valuesToInsert.push([name, uuid]);
    }
  }

  if (valuesToInsert.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid data to insert into column C." });
  }

  db.serialize(() => {
    db.run("BEGIN");

    db.run("DELETE FROM C", (err) => {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }

      const insertQuery = `
        INSERT INTO C (name, uuid)
        VALUES (?, ?)
      `;

      for (const [name, uuid] of valuesToInsert) {
        db.run(insertQuery, [name, uuid], (err) => {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
          }
        });
      }

      db.run("COMMIT", (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Items added to column C successfully" });
      });
    });
  });
};

exports.setActiveItemInTable = (req, res) => {
  const tableName = req.params.tableName;
  const { uuid } = req.params;

  const updateAllItemsQuery = `
    UPDATE ${tableName}
    SET isActive = 0
  `;

  db.run(updateAllItemsQuery, [], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const updateSelectedItemQuery = `
      UPDATE ${tableName}
      SET isActive = 1
      WHERE uuid = ?
    `;

    db.run(updateSelectedItemQuery, [uuid], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Active item selected successfully" });
    });
  });
};

const db = require("../db");

// Function to create a table if it doesn't exist and add its name to columns_list
function createTableIfNotExists(tableName, callback) {
  // Check if the tableName already exists in columns_list
  const checkIfExistsQuery = `
    SELECT COUNT(*) AS count FROM columns_list WHERE columnName = ?
  `;

  db.get(checkIfExistsQuery, [tableName], (err, row) => {
    if (err) {
      return callback(err);
    }

    // If the count is 0, the tableName doesn't exist, so we can create it
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
      // The tableName already exists in columns_list
      callback(null);
    }
  });
}


// Delete all columns
exports.deleteAllColumns = (req, res) => {
  // Fetch all column names from the "columns_list" table
  const selectColumnNamesQuery = `
    SELECT columnName FROM columns_list
  `;

  db.all(selectColumnNamesQuery, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Iterate through the fetched column names and delete the corresponding tables
    rows.forEach((row) => {
      const columnName = row.columnName;
      
      // Delete the table with the fetched columnName
      db.run(`DELETE FROM ${columnName}`, [], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    });

    res.json({ message: "All columns deleted successfully" });
  });
};

// Retrieve columns by name
exports.getColumnsByName = (req, res) => {
  const columnName = req.params.columnName;
  // Create the table if it doesn't exist
  createTableIfNotExists(columnName, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Now that the table exists (or already existed), you can execute the SELECT query
    const selectQuery = `SELECT * FROM ${columnName}`;
    db.all(selectQuery, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
};

// Add data to a table specified by columnName
exports.addDataToTable = (req, res) => {
  const columnName = req.params.columnName;
  const { name, isChecked,isActive,uuid } = req.body; // Assuming the request body includes name and isChecked properties
  const insertQuery = `
    INSERT INTO ${columnName} (name,${isChecked === false ? "isChecked," : ""}${isActive === false ? "isActive," : ""} uuid)
    VALUES (?,${isChecked === false ? "?," : ""}${isActive === false ? "?," : ""}?)
  `;

  // Execute the INSERT INTO query
  db.run(insertQuery, [name, isChecked ? 1 : isActive ? 1 : 0, uuid], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Respond with the ID of the newly inserted row
    res.json({ id: this.lastID });
  });
};

// Add multiple data to a table specified by columnName, skipping duplicates
exports.addMultipleDataToTable = (req, res) => {
  const columnName = req.params.columnName;
  const data = req.body; // Assuming the request body is an array of objects

  // Validate the data or perform any necessary input validation here

  // Construct the INSERT INTO query for batch insertion with an ON CONFLICT clause


  // Use a Set to track unique names and skip duplicates
  const uniqueNames = new Set();

  // Loop through the array and insert each object as a separate row
  data.forEach((item, index) => {
    const { name, isChecked,uuid } = item;

    const insertQuery = `
    INSERT INTO ${columnName} (name,${isChecked !== null ? "isChecked," : ""} uuid)
    VALUES (?,${isChecked !== null ? "?," : ""} ?)
  `;

    if (!uniqueNames.has(name)) {
      db.run(insertQuery, [name, isChecked ? 1 : 0, uuid], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Add the name to the uniqueNames Set
        uniqueNames.add(name);

        // Check if all inserts are complete
        if (uniqueNames.size === data.length) {
          // Respond with a success message or other appropriate response
          res.json({ message: "Data inserted successfully" });
        }
      });
    }
  });
};

exports.overwriteColumn = (req, res) => {
  console.log('updateColumn')
  const columnName = req.params.columnName;
  const { name, isChecked } = req.body; // Assuming the request body contains the updated data

  // Construct the UPDATE query to update all records in the column
  const updateQuery = `
    UPDATE ${columnName}
    SET name = ?, isChecked = ?
  `;

  db.run(updateQuery, [name, isChecked ? 1 : 0], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Records updated successfully" });
  });
};

// Update a record in a table specified by columnName by ID
exports.updateColumn = (req, res) => {
  console.log('updateColumn')
  const columnName = req.params.columnName;
  const { id } = req.params; // Assuming the request contains the record ID
  const { name, isChecked } = req.body; // Assuming the request body contains the updated data
  console.log(name,isChecked)
  // Construct the UPDATE query
  const updateQuery = `
    UPDATE ${columnName}
    SET name = ?, isChecked = ?
    WHERE id = ?
  `;

  db.run(updateQuery, [name, isChecked ? 1 : 0, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Record updated successfully" });
  });
};

// Delete a record from a table specified by columnName by ID
exports.deleteColumn = (req, res) => {
  const columnName = req.params.columnName;
  const { id } = req.params; // Assuming the request contains the record ID

  // Construct the DELETE query
  const deleteQuery = `
    DELETE FROM ${columnName}
    WHERE id = ?
  `;

  db.run(deleteQuery, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Record deleted successfully" });
  });
};


exports.addItemsToColumnC = (req, res) => {
  // Get the new data for column C from the request body
  const newDataForColumnC = req.body;

  // Check if newDataForColumnC is an array
  if (!Array.isArray(newDataForColumnC)) {
    return res.status(400).json({ error: "Invalid input data. Expected an array of objects." });
  }

  // Create an array to store the values to be inserted
  const valuesToInsert = [];

  // Iterate through the array and extract 'name' and 'uuid' properties
  for (const item of newDataForColumnC) {
    if (item && typeof item === "object" && "name" in item && "uuid" in item) {
      const { name, uuid } = item;
      valuesToInsert.push([name, uuid]);
    }
  }

  if (valuesToInsert.length === 0) {
    return res.status(400).json({ error: "No valid data to insert into column C." });
  }

  // Begin a transaction
  db.serialize(() => {
    db.run("BEGIN");

    // Delete existing data from table C
    db.run("DELETE FROM C", (err) => {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }

      // Insert the new data into table C
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

      // Commit the transaction
      db.run("COMMIT", (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Items added to column C successfully" });
      });
    });
  });
};

const express = require("express");
const app = express();
const cors = require("cors"); // Import the cors middleware

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173",'http://127.0.0.1:5173'],
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
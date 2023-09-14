const express = require("express");
const app = express();
// const routes = require("./routes");
const cors = require("cors");

// app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   })
// );
// app.use(cors());

// app.use("/api", routes);

app.use("/", async (req, res, next) => {
  return res.status(200).json({
    title: "EXE TASK API",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

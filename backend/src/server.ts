import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

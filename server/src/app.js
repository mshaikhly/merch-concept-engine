import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import merchRoutes from "./routes/merchRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server running" });
});

app.use("/api/merch", merchRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
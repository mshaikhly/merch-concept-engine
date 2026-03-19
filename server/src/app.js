import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server running" });
});

app.use("/api/knowledge", knowledgeRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
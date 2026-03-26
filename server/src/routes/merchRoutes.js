import express from "express";
import {
  generateDirections,
  expandDirection,
  saveConcept,
} from "../controllers/merchController.js";

const router = express.Router();

// Generate 3–5 merch directions from a brief
router.post("/generate-directions", generateDirections);

// Expand one direction into a full merch concept
router.post("/expand-direction", expandDirection);

// Save expanded concept to Notion
router.post("/save-concept", saveConcept);

export default router;
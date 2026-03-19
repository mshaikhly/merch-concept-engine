import express from "express";
import {
  generateRoot,
  expandNode,
  getWorkspaceTree,
  saveWorkspaceToNotion
} from "../controllers/knowledgeController.js";

const router = express.Router();

router.post("/generate-root", generateRoot);
router.post("/expand-node", expandNode);
router.get("/workspace/:workspaceId", getWorkspaceTree);
router.post("/save-workspace-to-notion", saveWorkspaceToNotion);


export default router;
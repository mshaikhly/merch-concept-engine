import {
  generateRootBranches,
  expandNodeBranches,
} from "../services/geminiService.js";
import { saveTreeToNotion } from "../services/notionService.js";
import { parseJsonFromText } from "../utils/parseJson.js";
import { prisma } from "../lib/prisma.js";


export const generateRoot = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const rawText = await generateRootBranches(topic);
    const structured = parseJsonFromText(rawText);

    const workspace = await prisma.workspace.create({
      data: {
        title: structured.rootTitle,
        rootTopic: topic,
      },
    });

    const rootNode = await prisma.node.create({
      data: {
        workspaceId: workspace.id,
        parentId: null,
        title: structured.rootTitle,
        summary: structured.rootSummary,
        depth: 0,
      },
    });

    const childNodes = await Promise.all(
      structured.children.map((child) =>
        prisma.node.create({
          data: {
            workspaceId: workspace.id,
            parentId: rootNode.id,
            title: child.title,
            summary: child.summary,
            depth: 1,
          },
        })
      )
    );

    return res.json({
      workspace,
      rootNode,
      childNodes,
    });
  } catch (error) {
    console.error("generateRoot error:", error);
    return res.status(500).json({
      error: "Failed to generate branches",
      details: error.message,
    });
  }
};

export const expandNode = async (req, res) => {
  try {
    const { nodeId } = req.body;

    if (!nodeId) {
      return res.status(400).json({ error: "nodeId is required" });
    }

    const node = await prisma.node.findUnique({
      where: { id: nodeId },
    });

    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }

    const ancestors = [];
    let currentParentId = node.parentId;

    while (currentParentId) {
      const parent = await prisma.node.findUnique({
        where: { id: currentParentId },
      });

      if (!parent) break;

      ancestors.unshift(parent.title);
      currentParentId = parent.parentId;
    }

    const rawText = await expandNodeBranches({
      nodeTitle: node.title,
      nodeSummary: node.summary,
      ancestorTitles: ancestors,
    });

    const structured = parseJsonFromText(rawText);

    const childNodes = await Promise.all(
      structured.children.map((child) =>
        prisma.node.create({
          data: {
            workspaceId: node.workspaceId,
            parentId: node.id,
            title: child.title,
            summary: child.summary,
            depth: node.depth + 1,
          },
        })
      )
    );

    return res.json({
      parentNode: node,
      childNodes,
    });
  } catch (error) {
    console.error("expandNode error:", error);
    return res.status(500).json({
      error: "Failed to expand node",
      details: error.message,
    });
  }
};

export const getWorkspaceTree = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId is required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const nodes = await prisma.node.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });

    const nodeMap = new Map();
    const tree = [];

    for (const node of nodes) {
      nodeMap.set(node.id, { ...node, children: [] });
    }

    for (const node of nodes) {
      const mappedNode = nodeMap.get(node.id);

      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(mappedNode);
        }
      } else {
        tree.push(mappedNode);
      }
    }

    return res.json({
      workspace,
      tree,
    });
  } catch (error) {
    console.error("getWorkspaceTree error:", error);
    return res.status(500).json({
      error: "Failed to fetch workspace tree",
      details: error.message,
    });
  }
};

export const saveWorkspaceToNotion = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId is required" });
    }

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_PARENT_PAGE_ID) {
      return res.status(500).json({
        error: "Missing Notion configuration in .env",
      });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const nodes = await prisma.node.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });

    const nodeMap = new Map();
    const tree = [];

    for (const node of nodes) {
      nodeMap.set(node.id, { ...node, children: [] });
    }

    for (const node of nodes) {
      const mappedNode = nodeMap.get(node.id);

      if (node.parentId) {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(mappedNode);
        }
      } else {
        tree.push(mappedNode);
      }
    }

    const savedRoots = [];

    for (const rootNode of tree) {
      const savedRoot = await saveTreeToNotion({
        node: rootNode,
        parentPageId: process.env.NOTION_PARENT_PAGE_ID,
        prisma,
      });

      savedRoots.push(savedRoot);
    }

    return res.json({
      message: "Workspace saved to Notion",
      workspace,
      savedRoots,
    });
  } catch (error) {
    console.error("saveWorkspaceToNotion error:", error);
    return res.status(500).json({
      error: "Failed to save workspace to Notion",
      details: error.message,
    });
  }
};
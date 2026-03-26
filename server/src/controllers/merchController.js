import {
  generateMerchDirections,
  expandMerchDirection,
} from "../services/geminiService.js";
import { saveConceptToNotionPage } from "../services/notionService.js";
import { parseJsonFromText } from "../utils/parseJson.js";

export const generateDirections = async (req, res) => {
  try {
    const { brand, niche, theme, productType, style, notes } = req.body;

    if (!brand?.trim() || !theme?.trim()) {
      return res.status(400).json({
        error: "Brand and theme are required",
      });
    }

    const rawText = await generateMerchDirections({
      brand,
      niche,
      theme,
      productType,
      style,
      notes,
    });

    const structured = parseJsonFromText(rawText);

    if (!structured?.directions || !Array.isArray(structured.directions)) {
      return res.status(500).json({
        error: "LLM returned invalid directions format",
      });
    }

    return res.json({
      directions: structured.directions,
    });
  } catch (error) {
    console.error("generateDirections error:", error);
    return res.status(500).json({
      error: "Failed to generate directions",
      details: error.message,
    });
  }
};

export const expandDirection = async (req, res) => {
  try {
    const { brief, direction } = req.body;

    if (!brief || !direction) {
      return res.status(400).json({
        error: "brief and direction are required",
      });
    }

    const rawText = await expandMerchDirection({
      brief,
      direction,
    });

    const structured = parseJsonFromText(rawText);

    if (!structured?.concept) {
      return res.status(500).json({
        error: "LLM returned invalid concept format",
      });
    }

    return res.json({
      concept: structured.concept,
    });
  } catch (error) {
    console.error("expandDirection error:", error);
    return res.status(500).json({
      error: "Failed to expand direction",
      details: error.message,
    });
  }
};

export const saveConcept = async (req, res) => {
  try {
    const { brief, concept } = req.body;

    if (!brief || !concept) {
      return res.status(400).json({
        error: "brief and concept are required",
      });
    }

    const notionResult = await saveConceptToNotionPage({
      brief,
      concept,
    });

    return res.json({
      success: true,
      pageId: notionResult?.pageId,
      notionUrl: notionResult?.url,
    });
  } catch (error) {
    console.error("saveConcept error:", error);
    return res.status(500).json({
      error: "Failed to save concept to Notion",
      details: error.message,
    });
  }
};
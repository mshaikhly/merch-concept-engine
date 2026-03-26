import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateMerchDirections = async ({
  brand,
  niche,
  theme,
  productType,
  style,
  notes,
}) => {
  const prompt = `
You are helping a clothing brand founder generate merchandise concepts.

Create exactly 4 distinct merch directions for this brief.

Brand: "${brand}"
Niche: "${niche || ""}"
Theme: "${theme}"
Product Type: "${productType || ""}"
Style: "${style || ""}"
Notes: "${notes || ""}"

Return JSON only.
Do not use markdown.
Do not wrap the JSON in code fences.
Do not include any explanation outside the JSON.

Requirements:
- Each direction must feel commercially usable
- Each direction must be visually distinct from the others
- Ideas must be specific enough to inspire actual apparel design
- Keep them practical for print-on-demand or DTG production
- Avoid generic filler language

Return JSON in exactly this shape:
{
  "directions": [
    {
      "id": "dir_1",
      "title": "string",
      "theme": "string",
      "targetAudience": "string",
      "shortDescription": "string",
      "visualStyle": "string",
      "placementHint": "string"
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const expandMerchDirection = async ({ brief, direction }) => {
  const prompt = `
You are expanding a merchandise direction into a production-ready apparel concept.

Brand: "${brief.brand}"
Niche: "${brief.niche || ""}"
Theme: "${brief.theme}"
Product Type: "${brief.productType || ""}"
Style: "${brief.style || ""}"
Notes: "${brief.notes || ""}"

Selected direction:
Title: "${direction.title}"
Theme: "${direction.theme}"
Target Audience: "${direction.targetAudience}"
Short Description: "${direction.shortDescription}"
Visual Style: "${direction.visualStyle}"
Placement Hint: "${direction.placementHint}"

Return JSON only.
Do not use markdown.
Do not wrap the JSON in code fences.
Do not include any explanation outside the JSON.

Requirements:
- Make the concept commercially strong and cohesive
- Make it specific enough for a designer to work from
- Include practical print notes
- Keep front and back concepts distinct where appropriate
- Make the mockup prompt visually clear and usable

Return JSON in exactly this shape:
{
  "concept": {
    "id": "string",
    "conceptName": "string",
    "collectionName": "string",
    "theme": "string",
    "audience": "string",
    "designSummary": "string",
    "frontDesign": "string",
    "backDesign": "string",
    "typography": "string",
    "colorPalette": ["string"],
    "printNotes": "string",
    "mockupPrompt": "string",
    "tags": ["string"],
    "status": "expanded"
  }
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
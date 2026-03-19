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

export const generateRootBranches = async (topic) => {
  const prompt = `
You are helping a user structure their thinking.

The user has entered this topic:
"${topic}"

Return JSON only.
Do not use markdown.
Do not wrap the JSON in code fences.
Do not include any explanation outside the JSON.

Generate:
1. rootTitle
2. rootSummary (2 to 3 concise sentences)
3. exactly 5 child topics
4. each child topic must have:
   - title
   - summary

Return JSON in exactly this shape:
{
  "rootTitle": "string",
  "rootSummary": "string",
  "children": [
    {
      "title": "string",
      "summary": "string"
    }
  ]
}
`;


  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
};

export const expandNodeBranches = async ({
  nodeTitle,
  nodeSummary,
  ancestorTitles = [],
}) => {
  const prompt = `
You are helping a user explore a topic in a structured way.

The user wants to expand this topic:
Title: "${nodeTitle}"
Summary: "${nodeSummary || ""}"

Ancestor topics:
${ancestorTitles.length ? ancestorTitles.map((t) => `- ${t}`).join("\n") : "- None"}

Return JSON only.
Do not use markdown.
Do not wrap the JSON in code fences.
Do not include any explanation outside the JSON.

Generate:
1. exactly 5 child topics
2. each child topic must have:
   - title
   - summary

Rules:
- Make the topics one level deeper than the current node
- Keep them distinct
- Avoid repeating ancestor topics
- Make them practical, specific, and useful
- Keep summaries concise

Return JSON in exactly this shape:
{
  "children": [
    {
      "title": "string",
      "summary": "string"
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
};
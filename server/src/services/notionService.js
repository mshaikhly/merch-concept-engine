import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const saveConceptToNotionPage = async ({ brief, concept }) => {
  if (!process.env.NOTION_PARENT_PAGE_ID) {
    throw new Error("NOTION_PARENT_PAGE_ID is missing in .env");
  }

  const page = await notion.pages.create({
    parent: {
      page_id: process.env.NOTION_PARENT_PAGE_ID,
    },
    properties: {
      title: {
        title: [
          {
            text: {
              content: concept.conceptName,
            },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Merch Brief",
              },
            },
          ],
        },
      },
      paragraphBlock(`Brand: ${brief.brand}`),
      paragraphBlock(`Niche: ${brief.niche || ""}`),
      paragraphBlock(`Theme: ${brief.theme}`),
      paragraphBlock(`Product Type: ${brief.productType || ""}`),
      paragraphBlock(`Style: ${brief.style || ""}`),
      paragraphBlock(`Notes: ${brief.notes || ""}`),

      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Expanded Concept",
              },
            },
          ],
        },
      },
      paragraphBlock(`Collection Name: ${concept.collectionName}`),
      paragraphBlock(`Audience: ${concept.audience}`),
      paragraphBlock(`Theme: ${concept.theme}`),
      paragraphBlock(`Status: ${concept.status}`),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Design Summary",
              },
            },
          ],
        },
      },
      paragraphBlock(concept.designSummary),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Front Design",
              },
            },
          ],
        },
      },
      paragraphBlock(concept.frontDesign),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Back Design",
              },
            },
          ],
        },
      },
      paragraphBlock(concept.backDesign),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Typography",
              },
            },
          ],
        },
      },
      paragraphBlock(concept.typography),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Colour Palette",
              },
            },
          ],
        },
      },
      bulletListBlocks(concept.colorPalette),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Print Notes",
              },
            },
          ],
        },
      },
      paragraphBlock(concept.printNotes),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Mockup Prompt",
              },
            },
          ],
        },
      },
      paragraphBlock(concept.mockupPrompt),

      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Tags",
              },
            },
          ],
        },
      },
      bulletListBlocks(concept.tags),
    ].flat(),
  });

  return {
    pageId: page.id,
    url: page.url,
  };
};

function paragraphBlock(content) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content: content || "",
          },
        },
      ],
    },
  };
}

function bulletListBlocks(items = []) {
  return items.map((item) => ({
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: {
            content: item,
          },
        },
      ],
    },
  }));
}
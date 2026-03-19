import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const saveTreeToNotion = async ({ node, parentPageId, prisma }) => {
  // Skip if this node already exists in Notion
  if (node.notionPageId) {
    const children = await prisma.node.findMany({
      where: {
        parentId: node.id,
      },
    });

    for (const child of children) {
      await saveTreeToNotion({
        node: child,
        parentPageId: node.notionPageId,
        prisma,
      });
    }

    return;
  }
  
  // 1️⃣ Create page in Notion
  const page = await notion.pages.create({
    parent: {
      page_id: parentPageId,
    },
    properties: {
      title: {
        title: [
          {
            text: {
              content: node.title,
            },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: node.summary || "",
              },
            },
          ],
        },
      },
    ],
  });

  // 2️⃣ Save Notion ID + URL in database
  await prisma.node.update({
    where: { id: node.id },
    data: {
      notionPageId: page.id,
      notionUrl: page.url,
    },
  });

  // 3️⃣ Get children of this node
  const children = await prisma.node.findMany({
    where: {
      parentId: node.id,
    },
  });

  // 4️⃣ Recursively create children pages
  for (const child of children) {
    await saveTreeToNotion({
      node: child,
      parentPageId: page.id,
      prisma,
    });
  }

  return page;
};
export type TreeNode = {
  id: string;
  workspaceId: string;
  parentId: string | null;
  title: string;
  summary: string | null;
  depth: number;
  notionPageId: string | null;
  notionUrl: string | null;
  createdAt: string;
  children: TreeNode[];
};

export type Workspace = {
  id: string;
  title: string;
  rootTopic: string;
  createdAt: string;
};

export type WorkspaceTreeResponse = {
  workspace: Workspace;
  tree: TreeNode[];
};

export type GenerateRootResponse = {
  workspace: Workspace;
  rootNode: Omit<TreeNode, "children">;
  childNodes: Omit<TreeNode, "children">[];
};

export type ExpandNodeResponse = {
  parentNode: Omit<TreeNode, "children">;
  childNodes: Omit<TreeNode, "children">[];
};
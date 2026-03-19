const API_BASE = "http://localhost:5001/api/knowledge";

export async function generateRoot(topic: string) {
  const res = await fetch(`${API_BASE}/generate-root`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to generate root");
  }

  return data;
}

export async function expandNode(nodeId: string) {
  const res = await fetch(`${API_BASE}/expand-node`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nodeId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to expand node");
  }

  return data;
}

export async function getWorkspaceTree(workspaceId: string) {
  const res = await fetch(`${API_BASE}/workspace/${workspaceId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch workspace tree");
  }

  return data;
}

export async function saveWorkspaceToNotion(workspaceId: string) {
  const res = await fetch(`${API_BASE}/save-workspace-to-notion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ workspaceId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to save workspace to Notion");
  }

  return data;
}
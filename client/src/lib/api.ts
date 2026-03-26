import {
  MerchBrief,
  MerchConcept,
  MerchDirection,
} from "@/src/types/merch";

const API_BASE = "http://localhost:5001/api/merch";

export async function generateDirections(
  brief: MerchBrief
): Promise<MerchDirection[]> {
  const res = await fetch(`${API_BASE}/generate-directions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brief),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to generate directions");
  }

  return data.directions;
}

export async function expandDirection(
  brief: MerchBrief,
  direction: MerchDirection
): Promise<MerchConcept> {
  const res = await fetch(`${API_BASE}/expand-direction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief, direction }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to expand direction");
  }

  return data.concept;
}

export async function saveConceptToNotion(
  brief: MerchBrief,
  concept: MerchConcept
): Promise<{ success: boolean; pageId?: string }> {
  const res = await fetch(`${API_BASE}/save-concept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief, concept }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to save concept to Notion");
  }

  return data;
}
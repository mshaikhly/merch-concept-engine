export type MerchBrief = {
  brand: string;
  niche: string;
  theme: string;
  productType: string;
  style: string;
  notes?: string;
};

export type MerchDirection = {
  id: string;
  title: string;
  theme: string;
  targetAudience: string;
  shortDescription: string;
  visualStyle: string;
  placementHint: string;
};

export type MerchConcept = {
  id: string;
  conceptName: string;
  collectionName: string;
  theme: string;
  audience: string;
  designSummary: string;
  frontDesign: string;
  backDesign: string;
  typography: string;
  colorPalette: string[];
  printNotes: string;
  mockupPrompt: string;
  tags: string[];
  status: "idea" | "expanded" | "saved";
};
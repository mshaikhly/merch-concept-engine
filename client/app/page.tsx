"use client";

import { useState } from "react";
import DirectionCard from "@/src/components/DirectionCard";
import {
  generateDirections,
  expandDirection,
  saveConceptToNotion,
} from "@/src/lib/api";
import {
  MerchBrief,
  MerchConcept,
  MerchDirection,
} from "@/src/types/merch";

const defaultBrief: MerchBrief = {
  brand: "Cool Brand",
  niche: "Cool streetwear",
  theme: "Bold",
  productType: "Hoodie",
  style: "Bold minimal typography",
  notes: "DTG-friendly, back design focus, black garment mockups",
};

export default function Home() {
  const [brief, setBrief] = useState<MerchBrief>(defaultBrief);
  const [directions, setDirections] = useState<MerchDirection[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<MerchConcept | null>(
    null
  );
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [expandingDirectionId, setExpandingDirectionId] = useState<string | null>(
    null
  );
  const [savingToNotion, setSavingToNotion] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleBriefChange = (
    field: keyof MerchBrief,
    value: string
  ) => {
    setBrief((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateDirections = async () => {
    try {
      if (!brief.brand.trim() || !brief.theme.trim()) return;

      setLoadingDirections(true);
      setError("");
      setSuccessMessage("");
      setDirections([]);
      setSelectedConcept(null);

      const data = await generateDirections(brief);
      setDirections(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate directions"
      );
    } finally {
      setLoadingDirections(false);
    }
  };

  const handleExpandDirection = async (direction: MerchDirection) => {
    try {
      setExpandingDirectionId(direction.id);
      setError("");
      setSuccessMessage("");

      const concept = await expandDirection(brief, direction);
      setSelectedConcept(concept);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to expand direction"
      );
    } finally {
      setExpandingDirectionId(null);
    }
  };

  const handleSaveToNotion = async () => {
    try {
      if (!selectedConcept) return;

      setSavingToNotion(true);
      setError("");
      setSuccessMessage("");

      await saveConceptToNotion(brief, selectedConcept);
      setSuccessMessage("Concept saved to Notion successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save concept to Notion"
      );
    } finally {
      setSavingToNotion(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-400">
            AI merch ideation system
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">
            Turn a merch brief into production-ready design concepts
          </h1>

          <p className="mt-4 text-base leading-7 text-neutral-400">
            Generate distinct merch directions, expand one into a full concept,
            and organise the output in Notion. Built for clothing founders,
            print-on-demand sellers, and brand owners who need a better ideation
            workflow.
          </p>
        </div>
      </section>

      {error && (
        <section className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </section>
      )}

      {successMessage && (
        <section className="rounded-2xl border border-green-900/50 bg-green-950/40 p-4 text-sm text-green-300">
          {successMessage}
        </section>
      )}

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-neutral-100">
            Merch brief
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Define the brand, theme, product type, and style direction.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Brand</label>
            <input
              value={brief.brand}
              onChange={(e) => handleBriefChange("brand", e.target.value)}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              placeholder="e.g. Muslim Manhood"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Niche</label>
            <input
              value={brief.niche}
              onChange={(e) => handleBriefChange("niche", e.target.value)}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              placeholder="e.g. Muslim men's streetwear"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Theme</label>
            <input
              value={brief.theme}
              onChange={(e) => handleBriefChange("theme", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleGenerateDirections();
                }
              }}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              placeholder="e.g. Discipline"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Product type</label>
            <input
              value={brief.productType}
              onChange={(e) => handleBriefChange("productType", e.target.value)}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              placeholder="e.g. Hoodie"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Style</label>
            <input
              value={brief.style}
              onChange={(e) => handleBriefChange("style", e.target.value)}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              placeholder="e.g. Bold minimal typography"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-neutral-300">Notes</label>
            <textarea
              value={brief.notes ?? ""}
              onChange={(e) => handleBriefChange("notes", e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
              placeholder="Add print constraints, mockup preferences, garment colour notes, etc."
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleGenerateDirections}
            disabled={loadingDirections}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingDirections ? "Generating..." : "Generate directions"}
          </button>

          <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
            <span className="rounded-full bg-neutral-800 px-3 py-1">
              Streetwear
            </span>
            <span className="rounded-full bg-neutral-800 px-3 py-1">
              DTG-friendly
            </span>
            <span className="rounded-full bg-neutral-800 px-3 py-1">
              Print-on-demand
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-100">
            Merch directions
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Generate 3–5 distinct directions, then expand one into a detailed
            concept.
          </p>
        </div>

        {directions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950 p-10 text-center">
            <p className="text-sm text-neutral-400">
              No directions yet. Enter a merch brief above and generate your
              first concepts.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {directions.map((direction) => (
              <DirectionCard
                key={direction.id}
                direction={direction}
                onExpand={handleExpandDirection}
                expandingDirectionId={expandingDirectionId}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-100">
              Expanded concept
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Turn one direction into something you can actually design from.
            </p>
          </div>

          {selectedConcept && (
            <button
              onClick={handleSaveToNotion}
              disabled={savingToNotion}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingToNotion ? "Saving..." : "Save to Notion"}
            </button>
          )}
        </div>

        {!selectedConcept ? (
          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950 p-10 text-center">
            <p className="text-sm text-neutral-400">
              Expand a direction to see the full merch concept here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Concept name
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-neutral-100">
                {selectedConcept.conceptName}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Collection
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  {selectedConcept.collectionName}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Audience
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  {selectedConcept.audience}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Design summary
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-200">
                {selectedConcept.designSummary}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Front design
                </p>
                <p className="mt-2 text-sm leading-7 text-neutral-200">
                  {selectedConcept.frontDesign}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Back design
                </p>
                <p className="mt-2 text-sm leading-7 text-neutral-200">
                  {selectedConcept.backDesign}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Typography
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  {selectedConcept.typography}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Colour palette
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedConcept.colorPalette.map((color) => (
                    <span
                      key={color}
                      className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-200"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedConcept.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Print notes
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-200">
                {selectedConcept.printNotes}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Mockup prompt
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-200">
                {selectedConcept.mockupPrompt}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
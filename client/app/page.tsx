"use client";

import { useState } from "react";
import TreeNodeCard from "@/src/components/TreeNodeCard";
import { generateRoot, expandNode, getWorkspaceTree, saveWorkspaceToNotion } from "@/src/lib/api";
import { TreeNode, Workspace } from "@/src/types/knowledge";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandingNodeId, setExpandingNodeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [savingToNotion, setSavingToNotion] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const refreshTree = async (workspaceId: string) => {
    const data = await getWorkspaceTree(workspaceId);
    setWorkspace(data.workspace);
    setTree(data.tree);
  };

  const handleGenerate = async () => {
    try {
      if (!topic.trim()) return;

      setLoading(true);
      setError("");
      setSuccessMessage("");
      setWorkspace(null);
      setTree([]);

      const data = await generateRoot(topic);
      await refreshTree(data.workspace.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (nodeId: string) => {
    try {
      if (!workspace) return;

      setExpandingNodeId(nodeId);
      setError("");
      setSuccessMessage("");

      await expandNode(nodeId);
      await refreshTree(workspace.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to expand node");
    } finally {
      setExpandingNodeId(null);
    }
  };

  const handleSaveToNotion = async () => {
    try {
      if (!workspace) return;

      setSavingToNotion(true);
      setError("");
      setSuccessMessage("");

      await saveWorkspaceToNotion(workspace.id);
      setSuccessMessage("Workspace saved to Notion successfully.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save to Notion");
    } finally {
      setSavingToNotion(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-400">
            AI thinking partner for everyday ideas
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-neutral-100">
            Turn scattered AI chats into structured thinking trees
          </h2>

          <p className="mt-4 text-base leading-7 text-neutral-400">
            Start with one idea, generate focused branches, and expand only what
            matters. RabbitHole AI helps you avoid context drift and keep useful
            insights organised.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleGenerate();
              }
            }}
            placeholder="Try: Launch a hoodie brand"
            className="flex-1 rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-500"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate tree"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-400">
          <span className="rounded-full bg-neutral-800 px-3 py-1">
            Business ideas
          </span>
          <span className="rounded-full bg-neutral-800 px-3 py-1">
            Learning topics
          </span>
          <span className="rounded-full bg-neutral-800 px-3 py-1">
            Personal research
          </span>
        </div>
      </section>

      {error && (
        <section className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </section>
      )}

      {workspace && (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Current workspace
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-neutral-100">
                {workspace.title}
              </h3>
            </div>

            <div className="rounded-xl bg-neutral-800 px-4 py-3 text-sm text-neutral-400">
              <span className="font-medium text-neutral-200">Workspace ID:</span>{" "}
              {workspace.id}
            </div>
          </div>
        </section>
      )}
      {workspace && (
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={handleSaveToNotion}
            disabled={savingToNotion}
            className="border rounded-xl px-4 py-2 bg-white text-gray-600"
          >
            {savingToNotion ? "Saving..." : "Save to Notion"}
          </button>

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}
        </div>
      )}

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-neutral-100">Knowledge tree</h3>
          <p className="mt-1 text-sm text-neutral-400">
            Expand any branch to go one level deeper.
          </p>
        </div>

        {tree.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950 p-10 text-center">
            <p className="text-sm text-neutral-400">
              No tree yet. Enter a topic above and generate your first RabbitHole.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tree.map((node) => (
              <TreeNodeCard
                key={node.id}
                node={node}
                onExpand={handleExpand}
                expandingNodeId={expandingNodeId}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
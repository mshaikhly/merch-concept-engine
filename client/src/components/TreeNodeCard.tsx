"use client";

import { TreeNode } from "@/src/types/knowledge";

type Props = {
  node: TreeNode;
  onExpand: (nodeId: string) => void;
  expandingNodeId: string | null;
};

export default function TreeNodeCard({
  node,
  onExpand,
  expandingNodeId,
}: Props) {
  const canExpand = node.children.length === 0;
  const isExpanding = expandingNodeId === node.id;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-400">
              Depth {node.depth}
            </span>

            {node.children.length > 0 && (
              <span className="rounded-full bg-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-200">
                {node.children.length} children
              </span>
            )}

            {node.notionUrl && (
              <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Synced to Notion
              </span>
            )}
          </div>

          <h4 className="text-base font-semibold text-neutral-100">
            {node.title}
          </h4>

          {node.summary && (
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              {node.summary}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {node.notionUrl && (
            <a
              href={node.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-800 bg-emerald-950 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-900"
            >
              Open Notion
            </a>
          )}

          {canExpand && (
            <button
              onClick={() => onExpand(node.id)}
              disabled={isExpanding}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExpanding ? "Expanding..." : "Expand"}
            </button>
          )}
        </div>
      </div>

      {node.children.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-neutral-800 pl-4">
          {node.children.map((child) => (
            <TreeNodeCard
              key={child.id}
              node={child}
              onExpand={onExpand}
              expandingNodeId={expandingNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
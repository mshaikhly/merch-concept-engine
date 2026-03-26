"use client";

import { MerchDirection } from "@/src/types/merch";

type Props = {
  direction: MerchDirection;
  onExpand: (direction: MerchDirection) => void;
  expandingDirectionId: string | null;
};

export default function DirectionCard({
  direction,
  onExpand,
  expandingDirectionId,
}: Props) {
  const isExpanding = expandingDirectionId === direction.id;

  return (
    <article className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm transition hover:border-neutral-700 hover:bg-neutral-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-200">
              {direction.theme}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {direction.title}
            </h3>
            <p className="max-w-3xl text-sm leading-7 text-neutral-300">
              {direction.shortDescription}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Visual style
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-200">
                {direction.visualStyle}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Placement hint
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-200">
                {direction.placementHint}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Target audience
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-300">
              {direction.targetAudience}
            </p>
          </div>
        </div>

        <div className="lg:w-auto lg:pl-4">
          <button
            onClick={() => onExpand(direction)}
            disabled={isExpanding}
            className="inline-flex min-w-[160px] items-center justify-center rounded-2xl border border-neutral-700 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExpanding ? "Expanding..." : "Expand concept"}
          </button>
        </div>
      </div>
    </article>
  );
}
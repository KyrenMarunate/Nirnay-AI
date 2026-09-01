import { AlertOctagon, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { CountTile, StatusPill, EngineTag } from "./primitives";
import {
  countResults,
  type Requirement,
  type RequirementResult,
} from "../../data/intelligenceData";

/**
 * Requirement-level compliance, not a single unexplained percentage.
 * A mandatory failure stays visually prominent regardless of the score.
 */
export function ComplianceOverview({
  requirements,
  results,
  score,
  onOpenRequirement,
  title = "Compliance Overview",
  description,
}: {
  requirements: Requirement[];
  results: RequirementResult[];
  score?: number;
  onOpenRequirement?: (requirementId: string) => void;
  title?: string;
  description?: string;
}) {
  const counts = countResults(results, requirements);
  const byId = new Map(requirements.map((r) => [r.id, r]));

  const criticalExceptions = results.filter((r) => {
    const req = byId.get(r.requirementId);
    return req?.mandatory && (r.status === "non-compliant" || r.status === "missing");
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#3d2b1f]">{title}</h2>
          <p className="mt-1 text-sm text-[#6b5c4a]">
            {description ?? `${counts.total} requirements evaluated against structured tender rules.`}
          </p>
        </div>
        {typeof score === "number" && (
          <div className="rounded-md border border-[#e5ded1] bg-white px-4 py-2 text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Overall score (secondary)</p>
            <p className="text-lg font-semibold text-[#3d2b1f]">{score}%</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-[#e5ded1] bg-[#e5ded1] lg:grid-cols-5">
        <CountTile label="Compliant" value={counts.compliant} tone="green" />
        <CountTile label="Non-Compliant" value={counts.nonCompliant} tone="red" />
        <CountTile label="Needs Review" value={counts.needsReview} tone="amber" />
        <CountTile label="Missing Evidence" value={counts.missing} tone="muted" />
        <CountTile label="Critical Failures" value={counts.criticalFailures} tone="red" emphasise />
      </div>

      {criticalExceptions.length > 0 && (
        <div className="rounded-[20px] border border-[#f0c9c9] bg-[#fdf4f4] p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[#9c3131]">
            <AlertOctagon size={17} /> Critical Exceptions
          </h3>
          <p className="mt-1 text-sm text-[#7a2b2b]">
            Mandatory requirements that are not satisfied. These remain visible regardless of the overall score.
          </p>
          <div className="mt-4 space-y-3">
            {criticalExceptions.map((result) => {
              const req = byId.get(result.requirementId);
              if (!req) return null;
              return (
                <button
                  key={result.requirementId}
                  onClick={() => onOpenRequirement?.(result.requirementId)}
                  className="flex w-full flex-col gap-3 rounded-lg border border-[#f0c9c9] bg-white p-4 text-left transition-colors hover:bg-[#fffafa] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#3d2b1f]">{req.name}</p>
                    <dl className="mt-2 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                      <div className="flex gap-2">
                        <dt className="text-[#8a7c68]">Required:</dt>
                        <dd className="font-medium text-[#3d2b1f]">{req.rule}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-[#8a7c68]">Bidder Evidence:</dt>
                        <dd className="font-medium text-[#3d2b1f]">{result.bidderValue}</dd>
                      </div>
                    </dl>
                    {result.evidence && (
                      <p className="mt-1.5 text-xs text-[#8a7c68]">
                        {result.evidence.document} — Page {result.evidence.page}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusPill status={result.status} />
                    <ChevronRight size={16} className="text-[#b3a892]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Clickable requirement-by-requirement result list. */
export function RequirementResultList({
  requirements,
  results,
  onOpenRequirement,
}: {
  requirements: Requirement[];
  results: RequirementResult[];
  onOpenRequirement: (requirementId: string) => void;
}) {
  const byId = new Map(results.map((r) => [r.requirementId, r]));

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
          <thead>
            <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
              <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Requirement</th>
              <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Rule</th>
              <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Bidder Value</th>
              <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Evidence</th>
              <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Status</th>
              <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => {
              const result = byId.get(req.id);
              if (!result) return null;
              const critical = req.mandatory && (result.status === "non-compliant" || result.status === "missing");
              return (
                <tr
                  key={req.id}
                  onClick={() => onOpenRequirement(req.id)}
                  className={cn(
                    "cursor-pointer border-b border-[#f0ebe0] transition-colors last:border-0 hover:bg-[#faf8f4]",
                    critical && "bg-[#fdf4f4] hover:bg-[#fbeded]"
                  )}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#3d2b1f]">{req.name}</p>
                    <p className="mt-0.5 text-xs text-[#8a7c68]">
                      {req.type}
                      {req.mandatory ? " · Mandatory" : " · Optional"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-[#5b4a3a]">{req.rule}</td>
                  <td className="px-5 py-4 text-[#5b4a3a]">{result.bidderValue}</td>
                  <td className="px-5 py-4 text-xs text-[#8a7c68]">
                    {result.evidence ? `${result.evidence.document} — p.${result.evidence.page}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={result.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#3d2b1f]">
                      View Evidence <ChevronRight size={14} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-[#f0ebe0] bg-[#faf8f4] px-5 py-3">
        <EngineTag>Rule Engine</EngineTag>
        <span className="text-xs text-[#8a7c68]">
          Objective comparisons are deterministic. Ambiguous cases are routed to human review instead of being decided
          automatically.
        </span>
      </div>
    </div>
  );
}

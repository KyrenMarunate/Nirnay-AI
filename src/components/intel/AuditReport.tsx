import { StatusPill } from "./primitives";
import { cn } from "../../utils/cn";
import type { Requirement, RequirementResult } from "../../data/intelligenceData";

/**
 * Auditable evaluation trail: requirement, rule applied, bidder value,
 * result, evidence location, explanation and the review decision.
 */
export function AuditReportTable({
  requirements,
  results,
}: {
  requirements: Requirement[];
  results: RequirementResult[];
}) {
  const byId = new Map(results.map((r) => [r.requirementId, r]));

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
          <thead>
            <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Requirement</th>
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Rule Applied</th>
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Bidder Value</th>
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Result</th>
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Evidence</th>
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Explanation</th>
              <th className="border-b border-[#e8e0d6] px-4 py-3.5 font-medium">Review Decision</th>
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
                  className={cn("border-b border-[#f0ebe0] align-top last:border-0", critical && "bg-[#fdf4f4]")}
                >
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-[#3d2b1f]">{req.name}</p>
                    <p className="text-xs text-[#a4977f]">{req.mandatory ? "Mandatory" : "Optional"}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <code className="rounded-md border border-[#e5ded1] bg-[#f6f1e8] px-2 py-0.5 font-mono text-[12px] text-[#5b4a3a]">
                      {req.rule}
                    </code>
                  </td>
                  <td className="px-4 py-3.5 text-[#5b4a3a]">{result.bidderValue}</td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={result.status} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#8a7c68]">
                    {result.evidence ? (
                      <>
                        {result.evidence.document}
                        <br />
                        Page {result.evidence.page}
                      </>
                    ) : (
                      "Not located"
                    )}
                  </td>
                  <td className="max-w-[280px] px-4 py-3.5 text-xs text-[#5b4a3a]">{result.explanation}</td>
                  <td className="px-4 py-3.5 text-xs text-[#5b4a3a]">
                    {result.humanReview === "Required"
                      ? "Routed to officer review"
                      : result.humanReview === "Completed"
                        ? "Reviewed by officer"
                        : "Not required — deterministic"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "../../utils/cn";
import { StatusGlyph, requirementStatusConfig } from "./primitives";
import { EvidenceDrawer } from "./EvidenceViewer";
import type { BidderIntelligence, Requirement, RequirementResult } from "../../data/intelligenceData";

type Filter = "all" | "critical" | "review" | "missing" | "high-risk";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical Failures" },
  { id: "review", label: "Needs Review" },
  { id: "missing", label: "Missing Evidence" },
  { id: "high-risk", label: "High Risk" },
];

/**
 * Requirement-by-requirement comparison across every bidder.
 * Each cell drills down to the evidence behind the result.
 */
export function ComplianceMatrix({
  requirements,
  bidders,
}: {
  requirements: Requirement[];
  bidders: BidderIntelligence[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<{
    requirement: Requirement;
    result: RequirementResult;
    bidderName: string;
  } | null>(null);

  const resultsByBidder = useMemo(
    () => bidders.map((b) => ({ bidder: b, map: new Map(b.results.map((r) => [r.requirementId, r])) })),
    [bidders]
  );

  const visible = useMemo(() => {
    if (filter === "all") return requirements;
    return requirements.filter((req) =>
      resultsByBidder.some(({ map }) => {
        const result = map.get(req.id);
        if (!result) return false;
        if (filter === "critical") return req.mandatory && (result.status === "non-compliant" || result.status === "missing");
        if (filter === "review") return result.status === "needs-review";
        if (filter === "missing") return result.status === "missing";
        return result.risk === "high";
      })
    );
  }, [filter, requirements, resultsByBidder]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
            <LayoutGrid size={17} className="text-[#8a5a35]" /> Multi-Bid Compliance Matrix
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-[#6b5c4a]">
            Every requirement, every bidder. Select any cell to open the evidence behind that result.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === f.id
                ? "border-[#3d2b1f] bg-[#3d2b1f] text-white"
                : "border-[#d8cfc2] bg-white text-[#5b4a3a] hover:bg-[#f7f3ec]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
            <thead>
              <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
                <th className="sticky left-0 z-10 border-b border-[#e8e0d6] bg-[#f8f3ee] px-5 py-3.5 font-medium">
                  Requirement
                </th>
                {resultsByBidder.map(({ bidder }) => (
                  <th key={bidder.bidderId} className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">
                    {bidder.bidderName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((req) => (
                <tr key={req.id} className="border-b border-[#f0ebe0] last:border-0 hover:bg-[#faf8f4]">
                  <td className="sticky left-0 z-10 bg-white px-5 py-3">
                    <p className="font-medium text-[#3d2b1f]">
                      {req.name} <span className="font-normal text-[#8a7c68]">{req.rule}</span>
                    </p>
                    <p className="text-xs text-[#a4977f]">{req.mandatory ? "Mandatory" : "Optional"}</p>
                  </td>
                  {resultsByBidder.map(({ bidder, map }) => {
                    const result = map.get(req.id);
                    if (!result)
                      return (
                        <td key={bidder.bidderId} className="px-5 py-3 text-[#c3b9a5]">
                          —
                        </td>
                      );
                    return (
                      <td key={bidder.bidderId} className="px-5 py-3">
                        <button
                          onClick={() => setSelected({ requirement: req, result, bidderName: bidder.bidderName })}
                          className="group inline-flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-[#f3ebdf]"
                          title={`${requirementStatusConfig[result.status].label} — ${result.bidderValue}`}
                        >
                          <StatusGlyph status={result.status} />
                          <span className="text-xs text-[#8a7c68] group-hover:text-[#3d2b1f]">{result.bidderValue}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={bidders.length + 1} className="px-5 py-8 text-center text-sm text-[#8a7c68]">
                    No requirements match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-[#f0ebe0] bg-[#faf8f4] px-5 py-3 text-xs text-[#8a7c68]">
          {(["compliant", "needs-review", "non-compliant", "missing"] as const).map((status) => (
            <span key={status} className="inline-flex items-center gap-1.5">
              <StatusGlyph status={status} />
              {requirementStatusConfig[status].label}
            </span>
          ))}
        </div>
      </div>

      <EvidenceDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        requirement={selected?.requirement ?? null}
        result={selected?.result ?? null}
        bidderName={selected?.bidderName}
      />
    </div>
  );
}

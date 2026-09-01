import { ShieldAlert, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { RiskPill } from "./primitives";
import type { RiskOverview } from "../../data/intelligenceData";

/**
 * Risk prioritisation — what an officer should look at first,
 * rather than a decorative Low/Medium/High badge.
 */
export function RiskOverviewPanel({
  risk,
  title = "Procurement Risk Overview",
  scopeLabel,
  priorityLink,
  compact,
}: {
  risk: RiskOverview;
  title?: string;
  scopeLabel?: string;
  priorityLink?: string;
  compact?: boolean;
}) {
  const breakdown = [
    { label: "Critical Exceptions", value: risk.criticalExceptions, tone: "text-[#9c3131]" },
    { label: "Missing Evidence", value: risk.missingEvidence, tone: "text-[#7a6a55]" },
    { label: "Conflicting Evidence", value: risk.conflictingEvidence, tone: "text-[#9c3131]" },
    { label: "Technical Concerns", value: risk.technicalConcerns, tone: "text-[#9c6b1a]" },
    { label: "Review Required", value: risk.reviewRequired, tone: "text-[#9c6b1a]" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
              <ShieldAlert size={17} className="text-[#8a5a35]" /> {title}
            </h3>
            {scopeLabel && <p className="mt-1 text-sm text-[#6b5c4a]">{scopeLabel}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8a7c68]">Overall Risk:</span>
            <RiskPill level={risk.level} label={risk.level === "low" ? "Low" : risk.level === "medium" ? "Medium" : "High"} />
          </div>
        </div>

        <div className={cn("mt-5 grid gap-px overflow-hidden rounded-lg border border-[#e5ded1] bg-[#e5ded1]", compact ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 lg:grid-cols-5")}>
          {breakdown.map((item) => (
            <div key={item.label} className="bg-white px-4 py-4">
              <p className={cn("text-xl font-semibold", item.value > 0 ? item.tone : "text-[#b3a892]")}>{item.value}</p>
              <p className="mt-1 text-xs text-[#6b5c4a]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "rounded-[20px] border p-5",
          risk.highestPriority.risk === "high"
            ? "border-[#f0c9c9] bg-[#fdf4f4]"
            : risk.highestPriority.risk === "medium"
              ? "border-[#f0dcb2] bg-[#fbf6ec]"
              : "border-[#c9e2cb] bg-[#f3f8f3]"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Highest Priority</p>
          <RiskPill level={risk.highestPriority.risk} />
        </div>
        <p className="mt-2 text-base font-semibold text-[#3d2b1f]">{risk.highestPriority.title}</p>
        <p className="mt-1 text-sm text-[#5b4a3a]">{risk.highestPriority.detail}</p>
        {priorityLink && (
          <Link
            to={priorityLink}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f] underline"
          >
            Open evidence <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

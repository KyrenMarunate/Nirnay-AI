import { GitCompareArrows } from "lucide-react";
import { cn } from "../../utils/cn";
import { RiskPill } from "./primitives";
import type { ConsistencyField, ConsistencyFinding } from "../../data/intelligenceData";

/**
 * Cross-document inconsistency engine: the same field, read from every
 * document that mentions it, compared side by side.
 */
export function ConsistencyCheck({
  fields,
  findings,
  title = "AI Consistency Check",
  description = "Values extracted from each submitted document are compared against each other. Differences are reported, never silently resolved.",
}: {
  fields: ConsistencyField[];
  findings: ConsistencyFinding[];
  title?: string;
  description?: string;
}) {
  const rows = fields.flatMap((field) =>
    field.rows.map((row, index) => ({
      key: `${field.field}-${row.document}`,
      field: field.field,
      showField: index === 0,
      document: row.document,
      value: row.value,
      page: row.page,
      consistent: field.consistent,
    }))
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
          <GitCompareArrows size={17} className="text-[#8a5a35]" /> {title}
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-[#6b5c4a]">{description}</p>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
            <thead>
              <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Field</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Document</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Extracted Value</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Page</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className={cn(
                    "border-b border-[#f0ebe0] last:border-0",
                    !row.consistent && "bg-[#fdf9f2]"
                  )}
                >
                  <td className="px-5 py-3 font-medium text-[#3d2b1f]">{row.showField ? row.field : ""}</td>
                  <td className="px-5 py-3 text-[#5b4a3a]">{row.document}</td>
                  <td className={cn("px-5 py-3", row.consistent ? "text-[#5b4a3a]" : "font-medium text-[#7a5510]")}>
                    {row.value}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#8a7c68]">p.{row.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {findings.length > 0 && (
        <div className="space-y-3">
          {findings.map((finding) => {
            const conflict = finding.kind === "conflict";
            return (
              <div
                key={finding.id}
                className={cn(
                  "rounded-[20px] border p-5",
                  conflict ? "border-[#f0c9c9] bg-[#fdf4f4]" : "border-[#f0dcb2] bg-[#fbf6ec]"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className={cn("text-base font-semibold", conflict ? "text-[#9c3131]" : "text-[#9c6b1a]")}>
                    {conflict ? "✕" : "⚠"} {finding.title}
                  </h4>
                  <RiskPill level={finding.risk} />
                </div>
                <p className="mt-2 text-sm text-[#5b4a3a]">“{finding.detail}”</p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {finding.sources.map((source) => (
                    <div
                      key={`${finding.id}-${source.document}`}
                      className="rounded-md border border-[#e5ded1] bg-white px-3 py-2"
                    >
                      <p className="text-xs text-[#8a7c68]">
                        {source.document} — p.{source.page}
                      </p>
                      <p className="text-sm font-medium text-[#3d2b1f]">{source.value}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-sm text-[#5b4a3a]">
                  <span className="font-medium text-[#3d2b1f]">Recommendation: </span>
                  {finding.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

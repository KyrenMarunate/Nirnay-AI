import { useState } from "react";
import { Check, AlertTriangle, X, FileUp, MessageSquareWarning } from "lucide-react";
import { Button } from "../ui";
import { cn } from "../../utils/cn";
import type { DocumentCheck } from "../../data/intelligenceData";

const rowConfig = {
  present: { icon: <Check size={14} strokeWidth={3} />, classes: "text-[#2f6b3a]", label: "Received" },
  attention: { icon: <AlertTriangle size={14} />, classes: "text-[#9c6b1a]", label: "Needs Attention" },
  missing: { icon: <X size={14} strokeWidth={3} />, classes: "text-[#9c3131]", label: "Missing" },
} as const;

/**
 * Missing-document engine: what the tender asked for vs what actually arrived.
 */
export function DocumentCompleteness({
  checklist,
  mode = "gov",
  onUpload,
  title = "Document Completeness",
}: {
  checklist: DocumentCheck[];
  mode?: "gov" | "bidder";
  onUpload?: (label: string) => void;
  title?: string;
}) {
  const [requested, setRequested] = useState<string[]>([]);
  const present = checklist.filter((d) => d.status !== "missing").length;
  const missing = checklist.filter((d) => d.status === "missing" && d.mandatory);
  const attention = checklist.filter((d) => d.status === "attention");

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#3d2b1f]">{title}</h3>
            <p className="mt-1 text-sm text-[#6b5c4a]">
              Checked against the documents the tender requires.
            </p>
          </div>
          <p className="text-2xl font-semibold text-[#3d2b1f]">
            {present} <span className="text-base font-normal text-[#8a7c68]">/ {checklist.length}</span>
          </p>
        </div>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {checklist.map((doc) => {
            const cfg = rowConfig[doc.status];
            return (
              <li
                key={doc.label}
                className={cn(
                  "flex items-start gap-2.5 rounded-md border px-3 py-2.5",
                  doc.status === "missing" ? "border-[#f0c9c9] bg-[#fdf4f4]" : "border-[#e5ded1] bg-white"
                )}
              >
                <span className={cn("mt-0.5 shrink-0", cfg.classes)}>{cfg.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#3d2b1f]">
                    {doc.label}
                    {doc.status === "missing" && <span className="text-[#9c3131]"> — Missing</span>}
                  </p>
                  {doc.fileName && <p className="text-xs text-[#8a7c68]">{doc.fileName}</p>}
                  {doc.note && <p className="mt-1 text-xs text-[#8a7c68]">{doc.note}</p>}
                </div>
              </li>
            );
          })}
        </ul>

        {attention.length > 0 && missing.length === 0 && (
          <p className="mt-4 rounded-md border border-[#f0dcb2] bg-[#fbf1e0] px-3 py-2 text-sm text-[#7a5510]">
            {attention.length} document{attention.length > 1 ? "s" : ""} received but flagged for verification.
          </p>
        )}
      </div>

      {missing.length > 0 && (
        <div className="rounded-[20px] border border-[#f0c9c9] bg-[#fdf4f4] p-5">
          <h4 className="text-base font-semibold text-[#9c3131]">
            {missing.length} Mandatory Document{missing.length > 1 ? "s" : ""} Missing
          </h4>
          <div className="mt-3 space-y-3">
            {missing.map((doc) => (
              <div
                key={doc.label}
                className="flex flex-col gap-3 rounded-lg border border-[#f0c9c9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#3d2b1f]">{doc.label}</p>
                  {doc.note && <p className="mt-0.5 text-sm text-[#6b5c4a]">{doc.note}</p>}
                  {requested.includes(doc.label) && (
                    <p className="mt-1 text-xs font-medium text-[#2f6b3a]">
                      Clarification request recorded in the audit trail.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {mode === "bidder" ? (
                    <Button size="sm" onClick={() => onUpload?.(doc.label)}>
                      <FileUp size={15} /> Upload Document
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setRequested((prev) => (prev.includes(doc.label) ? prev : [...prev, doc.label]))}
                    >
                      <MessageSquareWarning size={15} />
                      {requested.includes(doc.label) ? "Clarification Requested" : "Request Clarification"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

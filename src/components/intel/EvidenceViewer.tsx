import { FileText, FileX2, Quote } from "lucide-react";
import { Drawer, FieldBlock, StatusPill } from "./primitives";
import type { Evidence, Requirement, RequirementResult } from "../../data/intelligenceData";
import { cn } from "../../utils/cn";

/** A small stylised page preview so a result is visibly tied to its source. */
function PagePreview({ evidence }: { evidence: Evidence }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e5ded1] bg-white">
      <div className="flex items-center justify-between border-b border-[#f0ebe0] bg-[#f8f3ee] px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-[#5b4a3a]">
          <FileText size={14} /> {evidence.document}
        </span>
        <span className="rounded-full border border-[#e0d6c5] bg-white px-2 py-0.5 text-[11px] font-medium text-[#8a7c68]">
          Page {evidence.page}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <span className="block h-1.5 w-3/4 rounded-full bg-[#f1ece2]" />
        <span className="block h-1.5 w-full rounded-full bg-[#f1ece2]" />
        <div className="my-2 rounded-md border-l-2 border-[#8a5a35] bg-[#f9f2e6] px-3 py-2">
          <p className="flex gap-2 text-sm text-[#3d2b1f]">
            <Quote size={13} className="mt-1 shrink-0 text-[#8a5a35]" />
            <span>“{evidence.snippet}”</span>
          </p>
        </div>
        <span className="block h-1.5 w-5/6 rounded-full bg-[#f1ece2]" />
        <span className="block h-1.5 w-2/3 rounded-full bg-[#f1ece2]" />
      </div>
    </div>
  );
}

export function EvidenceBlock({
  requirement,
  result,
  evidence,
  heading = "Evidence",
}: {
  requirement: Requirement;
  result: RequirementResult;
  evidence?: Evidence | null;
  heading?: string;
}) {
  const source = evidence ?? result.evidence;

  if (!source) {
    return (
      <div className="rounded-lg border border-dashed border-[#e0d6c5] bg-[#faf8f4] p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-[#7a6a55]">
          <FileX2 size={15} /> No supporting evidence located
        </p>
        <p className="mt-1 text-sm text-[#8a7c68]">
          NirnayAI does not record a result for this requirement without a source document. The requirement is reported
          as missing evidence and routed for clarification.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">{heading}</p>
      <PagePreview evidence={source} />
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldBlock label="Extracted Value">
          <span className="font-medium">{source.extractedValue}</span>
        </FieldBlock>
        <FieldBlock label="Requirement">
          <span className="font-medium">
            {requirement.name} {requirement.rule}
          </span>
        </FieldBlock>
        <FieldBlock label="Result">
          <StatusPill status={result.status} />
        </FieldBlock>
        <FieldBlock label="Extraction Confidence">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#f1ece2]">
              <div
                className={cn("h-full rounded-full", source.confidence >= 85 ? "bg-[#2f6b3a]" : source.confidence >= 65 ? "bg-[#9c6b1a]" : "bg-[#9c3131]")}
                style={{ width: `${source.confidence}%` }}
              />
            </div>
            <span className="text-sm text-[#5b4a3a]">{source.confidence}%</span>
          </div>
        </FieldBlock>
      </div>
    </div>
  );
}

export function EvidenceDrawer({
  open,
  onClose,
  requirement,
  result,
  bidderName,
}: {
  open: boolean;
  onClose: () => void;
  requirement: Requirement | null;
  result: RequirementResult | null;
  bidderName?: string;
}) {
  if (!requirement || !result) return null;
  return (
    <Drawer open={open} onClose={onClose} title="Evidence" subtitle={bidderName ? `${requirement.name} · ${bidderName}` : requirement.name}>
      <div className="space-y-5">
        {result.conflictingEvidence && result.conflictingEvidence.length > 1 ? (
          <div className="space-y-5">
            <div className="rounded-lg border border-[#f0c9c9] bg-[#f8e9e9] p-4">
              <p className="text-sm font-semibold text-[#9c3131]">✕ Conflicting Evidence</p>
              <p className="mt-1 text-sm text-[#7a2b2b]">{result.explanation}</p>
            </div>
            {result.conflictingEvidence.map((ev) => (
              <EvidenceBlock
                key={`${ev.document}-${ev.page}`}
                requirement={requirement}
                result={result}
                evidence={ev}
                heading={`Source — ${ev.document}`}
              />
            ))}
          </div>
        ) : (
          <EvidenceBlock requirement={requirement} result={result} />
        )}

        <div className="rounded-lg border border-[#e5ded1] bg-white p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Explanation</p>
          <p className="mt-1 text-sm text-[#5b4a3a]">{result.explanation}</p>
        </div>
      </div>
    </Drawer>
  );
}

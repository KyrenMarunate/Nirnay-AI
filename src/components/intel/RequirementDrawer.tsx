import { Link } from "react-router-dom";
import { ArrowRight, ScrollText } from "lucide-react";
import { Drawer, FieldBlock, MandatoryTag, StatusPill, EngineTag, RiskPill } from "./primitives";
import { EvidenceBlock } from "./EvidenceViewer";
import type { Requirement, RequirementResult } from "../../data/intelligenceData";

/**
 * Requirement -> Rule -> Evidence -> Decision chain for a single requirement.
 * When no bidder result is supplied it shows the extracted tender rule only.
 */
export function RequirementDrawer({
  open,
  onClose,
  requirement,
  result,
  bidderName,
  reviewLink,
}: {
  open: boolean;
  onClose: () => void;
  requirement: Requirement | null;
  result?: RequirementResult | null;
  bidderName?: string;
  reviewLink?: string;
}) {
  if (!requirement) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={requirement.name}
      subtitle={bidderName ? `${requirement.type} requirement · ${bidderName}` : `${requirement.type} requirement`}
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-[#e5ded1] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Tender Requirement</p>
            <MandatoryTag mandatory={requirement.mandatory} />
          </div>
          <p className="mt-2 text-sm text-[#3d2b1f]">{requirement.tenderText}</p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[#8a7c68]">
            <ScrollText size={13} /> {requirement.clauseRef}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldBlock label="Rule">
            <code className="inline-block rounded-md border border-[#e5ded1] bg-[#f6f1e8] px-2 py-1 font-mono text-[12px] text-[#5b4a3a]">
              {requirement.expression}
            </code>
          </FieldBlock>
          <FieldBlock label="Rule Summary">
            <span className="font-medium">{requirement.rule}</span>
          </FieldBlock>
        </div>

        {result ? (
          <>
            <div className="grid gap-4 rounded-lg border border-[#e5ded1] bg-white p-4 sm:grid-cols-2">
              <FieldBlock label="Bidder Value">
                <span className="font-medium">{result.bidderValue}</span>
              </FieldBlock>
              <FieldBlock label="Status">
                <StatusPill status={result.status} />
              </FieldBlock>
              <FieldBlock label="Evaluated By">
                <EngineTag>{result.decidedBy}</EngineTag>
              </FieldBlock>
              <FieldBlock label="Human Review">
                <span className={result.humanReview === "Required" ? "font-medium text-[#9c6b1a]" : "text-[#5b4a3a]"}>
                  {result.humanReview}
                </span>
              </FieldBlock>
            </div>

            <EvidenceBlock requirement={requirement} result={result} />

            <div className="rounded-lg border border-[#e5ded1] bg-white p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Explanation</p>
              <p className="mt-1 text-sm text-[#5b4a3a]">“{result.explanation}”</p>
              {result.ambiguity && (
                <p className="mt-3 rounded-md border border-[#f0dcb2] bg-[#fbf1e0] px-3 py-2 text-sm text-[#7a5510]">
                  <span className="font-medium">Why this is not decided automatically: </span>
                  {result.ambiguity}
                </p>
              )}
              {result.risk && (
                <div className="mt-3">
                  <RiskPill level={result.risk} />
                </div>
              )}
            </div>

            {reviewLink && result.humanReview === "Required" && (
              <Link
                to={reviewLink}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f] underline"
              >
                Open in Human Review queue <ArrowRight size={14} />
              </Link>
            )}
          </>
        ) : (
          <div className="rounded-md border border-[#d8cfc2] bg-[#f7f3ec] px-4 py-3 text-sm text-[#5b4a3a]">
            This rule was structured from the tender document. Bidder values and evidence appear once a bid is
            evaluated against it.
          </div>
        )}
      </div>
    </Drawer>
  );
}

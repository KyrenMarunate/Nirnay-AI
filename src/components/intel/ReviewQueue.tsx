import { useState } from "react";
import { UserCheck, Check, X, MessageSquare } from "lucide-react";
import { Button, EmptyState } from "../ui";
import { cn } from "../../utils/cn";
import { StatusPill, EngineTag } from "./primitives";
import { EvidenceDrawer } from "./EvidenceViewer";
import type { ReviewCase } from "../../data/intelligenceData";

type Decision = "accepted" | "rejected";

interface CaseState {
  decision?: Decision;
  comment?: string;
}

/**
 * Human review queue. The AI routes ambiguity here instead of resolving it —
 * uncertain technical equivalence is never auto-approved.
 */
export function ReviewQueue({ cases, officerName = "Ananya Sharma" }: { cases: ReviewCase[]; officerName?: string }) {
  const [state, setState] = useState<Record<string, CaseState>>({});
  const [commentFor, setCommentFor] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [evidenceCase, setEvidenceCase] = useState<ReviewCase | null>(null);

  const keyOf = (c: ReviewCase) => `${c.bidderId}:${c.requirement.id}`;

  const decide = (c: ReviewCase, decision: Decision) =>
    setState((prev) => ({ ...prev, [keyOf(c)]: { ...prev[keyOf(c)], decision } }));

  const saveComment = (c: ReviewCase) => {
    setState((prev) => ({ ...prev, [keyOf(c)]: { ...prev[keyOf(c)], comment: draft.trim() || undefined } }));
    setCommentFor(null);
    setDraft("");
  };

  const pending = cases.filter((c) => !state[keyOf(c)]?.decision).length;

  if (cases.length === 0) {
    return (
      <EmptyState
        icon={<UserCheck size={26} className="text-[#b3a892]" />}
        title="No cases awaiting human review"
        description="Every evaluated requirement was resolved deterministically with supporting evidence."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
              <UserCheck size={17} className="text-[#8a5a35]" /> Human Review Required
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-[#6b5c4a]">
              Cases where the evidence is ambiguous, conflicting or requires a technical judgement. NirnayAI does not
              approve uncertain equivalence — an officer decides.
            </p>
          </div>
          <div className="rounded-md border border-[#e5ded1] bg-[#faf8f4] px-4 py-2 text-right">
            <p className="text-lg font-semibold text-[#3d2b1f]">
              {pending}
              <span className="text-sm font-normal text-[#8a7c68]"> / {cases.length}</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#a4977f]">Awaiting decision</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cases.map((c) => {
          const key = keyOf(c);
          const current = state[key] ?? {};
          return (
            <div
              key={key}
              className={cn(
                "rounded-[20px] border bg-white p-6",
                current.decision === "accepted"
                  ? "border-[#c9e2cb]"
                  : current.decision === "rejected"
                    ? "border-[#f0c9c9]"
                    : "border-[#e5ded1]"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[#3d2b1f]">{c.requirement.name}</h3>
                  <p className="mt-0.5 text-sm text-[#8a7c68]">
                    {c.bidderName} · {c.requirement.type}
                    {c.requirement.mandatory ? " · Mandatory" : ""}
                  </p>
                </div>
                <StatusPill status={c.result.status} />
              </div>

              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Tender</dt>
                  <dd className="mt-1 text-sm font-medium text-[#3d2b1f]">{c.requirement.rule}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Bidder</dt>
                  <dd className="mt-1 text-sm font-medium text-[#3d2b1f]">{c.result.bidderValue}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Evidence</dt>
                  <dd className="mt-1 text-sm text-[#5b4a3a]">
                    {c.result.evidence ? `${c.result.evidence.document} — p.${c.result.evidence.page}` : "Not located"}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 rounded-md border border-[#f0dcb2] bg-[#fbf1e0] px-4 py-3">
                <p className="text-sm font-semibold text-[#9c6b1a]">AI Result: Needs Review</p>
                <p className="mt-1 text-sm text-[#7a5510]">“{c.result.explanation}”</p>
                {c.result.ambiguity && <p className="mt-1 text-sm text-[#7a5510]">{c.result.ambiguity}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <EngineTag>{c.result.decidedBy}</EngineTag>
                  {typeof c.result.reviewConfidence === "number" && (
                    <span className="text-xs text-[#8a7c68]">Confidence {c.result.reviewConfidence}%</span>
                  )}
                </div>
              </div>

              {current.comment && (
                <p className="mt-3 rounded-md border border-[#e5ded1] bg-[#faf8f4] px-3 py-2 text-sm text-[#5b4a3a]">
                  <span className="font-medium text-[#3d2b1f]">{officerName}: </span>
                  {current.comment}
                </p>
              )}

              {commentFor === key && (
                <div className="mt-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    placeholder="Record an officer note for the audit trail…"
                    className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] p-3 text-sm outline-none focus:border-[#8a5a35]"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => saveComment(c)}>
                      Save Comment
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setCommentFor(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEvidenceCase(c)}>
                  Review Evidence
                </Button>
                <Button
                  size="sm"
                  variant={current.decision === "accepted" ? "primary" : "secondary"}
                  onClick={() => decide(c, "accepted")}
                >
                  <Check size={15} /> Accept
                </Button>
                <Button
                  size="sm"
                  variant={current.decision === "rejected" ? "danger" : "secondary"}
                  onClick={() => decide(c, "rejected")}
                >
                  <X size={15} /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCommentFor(key);
                    setDraft(current.comment ?? "");
                  }}
                >
                  <MessageSquare size={15} /> Add Comment
                </Button>

                {current.decision && (
                  <span
                    className={cn(
                      "ml-auto text-xs font-medium",
                      current.decision === "accepted" ? "text-[#2f6b3a]" : "text-[#9c3131]"
                    )}
                  >
                    Officer decision recorded: {current.decision === "accepted" ? "Accepted" : "Rejected"} · {officerName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EvidenceDrawer
        open={evidenceCase !== null}
        onClose={() => setEvidenceCase(null)}
        requirement={evidenceCase?.requirement ?? null}
        result={evidenceCase?.result ?? null}
        bidderName={evidenceCase?.bidderName}
      />
    </div>
  );
}

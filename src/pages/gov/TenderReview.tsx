import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Flag } from "lucide-react";
import { PageContainer, SectionCard, TenderStatusBadge, ComplianceScore, Button, ConfirmationModal, Timeline, Notice } from "../../components/ui";
import { TenderIntelligence } from "../../components/intel/TenderIntelligence";
import { ComplianceMatrix } from "../../components/intel/ComplianceMatrix";
import { ReviewQueue } from "../../components/intel/ReviewQueue";
import { RiskOverviewPanel } from "../../components/intel/RiskOverviewPanel";
import { AIPipelineStrip } from "../../components/intel/AIPipelineStrip";
import { StatusGlyph } from "../../components/intel/primitives";
import {
  aggregateRisk,
  countResults,
  getRequirements,
  getReviewQueue,
  getTenderIntelligence,
} from "../../data/intelligenceData";
import { tenders, formatINR } from "../../data/mockData";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

type Tab = "bids" | "intelligence" | "matrix" | "review" | "risk" | "evaluate";

const tabLabels: Record<Tab, string> = {
  bids: "Submitted Bids",
  intelligence: "Tender Intelligence",
  matrix: "Compliance Matrix",
  review: "Human Review",
  risk: "Risk Overview",
  evaluate: "Tender Evaluation",
};

export default function TenderReview() {
  const { id } = useParams();
  const tender = tenders.find((t) => t.id === decodeURIComponent(id ?? ""));
  const { bidsState, updateBid } = useApp();
  const [tab, setTab] = useState<Tab>("bids");
  const [selectedBidderId, setSelectedBidderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<null | "approve" | "reject" | "return">(null);
  const [approved, setApproved] = useState(false);

  const tenderBids = useMemo(() => bidsState.filter((b) => b.tenderId === tender?.id), [bidsState, tender]);
  const requirements = getRequirements(tender?.id);
  const intelligence = getTenderIntelligence(tender?.id);
  const reviewQueue = getReviewQueue(tender?.id);
  const tenderRisk = aggregateRisk(tender?.id);
  const hasIntelligence = requirements.length > 0 && intelligence.length > 0;

  if (!tender) {
    return (
      <PageContainer>
        <p>Tender not found.</p>
      </PageContainer>
    );
  }

  const selectedBid = tenderBids.find((b) => b.bidderId === selectedBidderId) ?? tenderBids[0];

  const runDecision = () => {
    if (!selectedBid) return;
    if (confirmAction === "approve") {
      updateBid(selectedBid.id, { status: "Approved" });
      tenderBids
        .filter((b) => b.id !== selectedBid.id)
        .forEach((b) =>
          updateBid(b.id, {
            status: "Rejected",
            reasonForDecision: "The submitted bid did not satisfy the required technical eligibility criteria as strongly as the selected bidder.",
          })
        );
      setApproved(true);
    } else if (confirmAction === "reject") {
      updateBid(selectedBid.id, { status: "Rejected", reasonForDecision: "The submitted bid did not satisfy the required eligibility criteria." });
    } else if (confirmAction === "return") {
      updateBid(selectedBid.id, { status: "Action Required" });
    }
    setConfirmAction(null);
  };

  if (approved && selectedBid) {
    return (
      <PageContainer className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[#e5ded1] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf3ea]">
            <CheckCircle2 size={28} className="text-[#2f6b3a]" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Tender Approved</h1>
          <p className="mt-3 text-sm text-[#6b5c4a]">Selected Bidder</p>
          <p className="text-lg font-semibold text-[#3d2b1f]">{selectedBid.bidderName}</p>
          <p className="mt-2 text-sm text-[#6b5c4a]">Tender</p>
          <p className="font-medium text-[#3d2b1f]">{tender.title}</p>
          <div className="mt-4 inline-flex rounded-full border border-[#c9e2cb] bg-[#eaf3ea] px-3.5 py-1.5 text-sm font-medium text-[#2f6b3a]">Final Status: Approved</div>
        </motion.div>

        <SectionCard className="mt-6">
          <h2 className="text-lg font-semibold">Approval Timeline</h2>
          <div className="mt-4">
            <Timeline
              steps={[
                { label: "Tender Published", state: "done" },
                { label: "Bids Received", state: "done" },
                { label: "Compliance Verification", state: "done" },
                { label: "Officer Evaluation", state: "done" },
                { label: "Bidder Selected", state: "done" },
                { label: "Tender Approved", state: "done" },
              ]}
            />
          </div>
        </SectionCard>

        <div className="mt-6 flex justify-center">
          <Link to="/gov/tenders"><Button variant="secondary">Back to Tenders</Button></Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{tender.title}</h1>
        <TenderStatusBadge status={tender.status} />
      </div>
      <p className="mt-2 text-[#6b5c4a]">{tender.department}</p>
      <p className="mt-1 font-mono text-sm text-[#8a7c68]">Tender ID: {tender.id}</p>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[#e5ded1]">
        {(["bids", "intelligence", "matrix", "review", "risk", "evaluate"] as Tab[])
          .filter((t) => hasIntelligence || t === "bids" || t === "evaluate")
          .map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors",
                tab === t ? "border-[#3d2b1f] text-[#3d2b1f]" : "border-transparent text-[#8a7c68] hover:text-[#3d2b1f]"
              )}
            >
              {tabLabels[t]}
              {t === "review" && reviewQueue.length > 0 && (
                <span className="ml-2 rounded-full border border-[#f0dcb2] bg-[#fbf1e0] px-1.5 py-0.5 text-[11px] text-[#9c6b1a]">
                  {reviewQueue.length}
                </span>
              )}
            </button>
          ))}
      </div>

      {tab === "bids" && (
        <div className="mt-6 space-y-5">
          {hasIntelligence && (
            <div className="rounded-md border border-[#d8cfc2] bg-[#f7f3ec] px-4 py-3 text-sm text-[#5b4a3a]">
              Each bid below is evaluated requirement by requirement. The percentage is a secondary summary — mandatory
              failures are always listed separately.
            </div>
          )}
          <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
                <thead>
                  <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Bidder</th>
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Requirement Outcome</th>
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Critical Failures</th>
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Quotation</th>
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Status</th>
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {tenderBids.map((b) => {
                    const intel = intelligence.find((i) => i.bidderId === b.bidderId);
                    const counts = intel ? countResults(intel.results, requirements) : null;
                    return (
                      <tr key={b.id} className="border-b border-[#f0ebe0] last:border-0 hover:bg-[#faf8f4]">
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#3d2b1f]">{b.bidderName}</p>
                          <p className="mt-0.5 text-xs text-[#8a7c68]">Overall score {b.compliance}% (secondary)</p>
                        </td>
                        <td className="px-5 py-4">
                          {counts ? (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5b4a3a]">
                              <span className="inline-flex items-center gap-1">
                                <StatusGlyph status="compliant" /> {counts.compliant}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <StatusGlyph status="needs-review" /> {counts.needsReview}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <StatusGlyph status="non-compliant" /> {counts.nonCompliant}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <StatusGlyph status="missing" /> {counts.missing}
                              </span>
                              <span className="text-[#a4977f]">of {counts.total}</span>
                            </div>
                          ) : (
                            <span className="text-[#8a7c68]">{b.compliance}%</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {counts && counts.criticalFailures > 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0c9c9] bg-[#f8e9e9] px-2.5 py-1 text-xs font-medium text-[#9c3131]">
                              {counts.criticalFailures} mandatory
                            </span>
                          ) : (
                            <span className="text-xs text-[#8a7c68]">{counts ? "None" : b.warnings.length}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-[#5b4a3a]">{formatINR(b.quotation.finalAmount)}</td>
                        <td className="px-5 py-4 text-[#5b4a3a]">
                          {b.status === "Flagged" ? <Flag size={14} className="inline text-[#9c3131]" /> : null}{" "}
                          <span>{b.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <Link to={`/gov/tenders/${encodeURIComponent(tender.id)}/bidders/${b.bidderId}`}>
                            <Button variant="ghost" size="sm">Review</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "intelligence" && hasIntelligence && (
        <div className="mt-6 space-y-5">
          <AIPipelineStrip highlight="nlp" />
          <TenderIntelligence requirements={requirements} tenderTitle={tender.title} analysedLabel={tender.publishedDate} />
        </div>
      )}

      {tab === "matrix" && hasIntelligence && (
        <div className="mt-6 space-y-6">
          <ComplianceMatrix requirements={requirements} bidders={intelligence} />

          <SectionCard>
            <h3 className="text-lg font-semibold">Commercial & Delivery Comparison</h3>
            <p className="mt-1 text-sm text-[#6b5c4a]">
              Commercial factors are shown alongside compliance — never as a substitute for it.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
                <thead>
                  <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
                    <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Criteria</th>
                    {tenderBids.map((b) => (
                      <th key={b.id} className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">{b.bidderName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label="Overall Score (secondary)" cells={tenderBids.map((b) => `${b.compliance}%`)} />
                  <CompareRow label="Document Completion" cells={tenderBids.map((b) => b.documentsComplete)} />
                  <CompareRow label="Quotation" cells={tenderBids.map((b) => formatINR(b.quotation.finalAmount))} />
                  <CompareRow label="Delivery Capacity" cells={tenderBids.map((b) => b.productDetails.deliveryCapacity)} />
                  <CompareRow
                    label="Critical Failures"
                    cells={tenderBids.map((b) => {
                      const intel = intelligence.find((i) => i.bidderId === b.bidderId);
                      return intel ? String(countResults(intel.results, requirements).criticalFailures) : "—";
                    })}
                  />
                  <tr>
                    <td className="px-5 py-4"></td>
                    {tenderBids.map((b) => (
                      <td key={b.id} className="px-5 py-4">
                        <Button
                          size="sm"
                          variant={selectedBidderId === b.bidderId ? "primary" : "secondary"}
                          onClick={() => {
                            setSelectedBidderId(b.bidderId);
                            setTab("evaluate");
                          }}
                        >
                          Select Bidder
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "review" && hasIntelligence && (
        <div className="mt-6 space-y-5">
          <AIPipelineStrip highlight="review" />
          <ReviewQueue cases={reviewQueue} />
        </div>
      )}

      {tab === "risk" && hasIntelligence && (
        <div className="mt-6 space-y-6">
          <RiskOverviewPanel
            risk={tenderRisk}
            scopeLabel={`Across ${intelligence.length} evaluated bids for this tender.`}
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {intelligence.map((intel) => (
              <SectionCard key={intel.bidderId}>
                <p className="font-semibold text-[#3d2b1f]">{intel.bidderName}</p>
                <p className="mt-0.5 text-xs text-[#8a7c68]">Overall score {intel.overallScore}% (secondary)</p>
                <ul className="mt-3 space-y-1.5 text-sm text-[#5b4a3a]">
                  <li className="flex justify-between">
                    <span>Critical exceptions</span>
                    <span className={intel.risk.criticalExceptions ? "font-semibold text-[#9c3131]" : ""}>
                      {intel.risk.criticalExceptions}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Missing evidence</span>
                    <span>{intel.risk.missingEvidence}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Conflicting evidence</span>
                    <span>{intel.risk.conflictingEvidence}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Review required</span>
                    <span>{intel.risk.reviewRequired}</span>
                  </li>
                </ul>
                <Link
                  to={`/gov/tenders/${encodeURIComponent(tender.id)}/bidders/${intel.bidderId}`}
                  className="mt-4 inline-block text-sm font-medium text-[#3d2b1f] underline"
                >
                  Open bidder review
                </Link>
              </SectionCard>
            ))}
          </div>
        </div>
      )}


      {tab === "evaluate" && (
        <div className="mt-6">
          <SectionCard>
            <h2 className="text-lg font-semibold">Tender Evaluation</h2>
            <p className="mt-1 text-sm text-[#6b5c4a]">Choose the bidder to finalize for this tender.</p>
            <div className="mt-5 grid gap-3">
              {tenderBids.map((b) => {
                const intel = intelligence.find((i) => i.bidderId === b.bidderId);
                const counts = intel ? countResults(intel.results, requirements) : null;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBidderId(b.bidderId)}
                    className={cn(
                      "flex items-center justify-between rounded-md border p-4 text-left transition-colors",
                      selectedBidderId === b.bidderId ? "border-[#3d2b1f] bg-[#f6f1e8]" : "border-[#e5ded1] hover:bg-[#faf8f4]"
                    )}
                  >
                    <div>
                      <p className="font-medium text-[#3d2b1f]">{b.bidderName}</p>
                      <p className="text-sm text-[#6b5c4a]">
                        {formatINR(b.quotation.finalAmount)}
                        {counts
                          ? ` · ${counts.compliant}/${counts.total} requirements compliant`
                          : ` · ${b.warnings.length} warning${b.warnings.length !== 1 ? "s" : ""}`}
                      </p>
                      {counts && counts.criticalFailures > 0 && (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#f0c9c9] bg-[#f8e9e9] px-2.5 py-0.5 text-xs font-medium text-[#9c3131]">
                          {counts.criticalFailures} mandatory requirement{counts.criticalFailures > 1 ? "s" : ""} not satisfied
                        </p>
                      )}
                    </div>
                    <ComplianceScore value={b.compliance} size="sm" />
                  </button>
                );
              })}
            </div>

            {hasIntelligence && (
              <div className="mt-5">
                <Notice>
                  NirnayAI does not select a winner or approve a tender. It presents evidence, exceptions and risk — the
                  authorised officer makes the final decision.
                </Notice>
              </div>
            )}

            {selectedBid && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => setConfirmAction("approve")}>Approve Tender</Button>
                <Button variant="secondary" onClick={() => setConfirmAction("return")}>Return for Review</Button>
                <Button variant="danger" onClick={() => setConfirmAction("reject")}>Reject Bid</Button>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      <ConfirmationModal
        open={confirmAction !== null}
        title={confirmAction === "approve" ? "Confirm Tender Selection" : confirmAction === "reject" ? "Reject Bid?" : "Return for Review?"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={runDecision}
        confirmLabel={confirmAction === "approve" ? "Approve Tender" : confirmAction === "reject" ? "Reject Bid" : "Return for Review"}
        danger={confirmAction === "reject"}
      >
        {selectedBid && confirmAction === "approve" && (
          <>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-[#a4977f]">Selected Bidder</dt><dd className="font-medium">{selectedBid.bidderName}</dd></div>
              <div><dt className="text-xs text-[#a4977f]">Bid Value</dt><dd className="font-medium">{formatINR(selectedBid.quotation.finalAmount)}</dd></div>
              <div><dt className="text-xs text-[#a4977f]">Overall Score</dt><dd className="font-medium">{selectedBid.compliance}%</dd></div>
              <div><dt className="text-xs text-[#a4977f]">Warnings</dt><dd className="font-medium">{selectedBid.warnings.length}</dd></div>
            </dl>
            {(() => {
              const intel = intelligence.find((i) => i.bidderId === selectedBid.bidderId);
              const counts = intel ? countResults(intel.results, requirements) : null;
              if (!counts || counts.criticalFailures === 0) return null;
              return (
                <p className="mt-4 rounded-md border border-[#f0c9c9] bg-[#f8e9e9] px-3 py-2 text-sm font-medium text-[#9c3131]">
                  {counts.criticalFailures} mandatory requirement{counts.criticalFailures > 1 ? "s are" : " is"} not
                  satisfied for this bidder. Recording an approval requires a written justification.
                </p>
              );
            })()}
          </>
        )}
      </ConfirmationModal>
    </PageContainer>
  );
}

function CompareRow({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-b border-[#f0ebe0]">
      <td className="sticky left-0 bg-white px-5 py-3 font-medium text-[#3d2b1f]">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className="px-5 py-3 text-[#5b4a3a]">{c}</td>
      ))}
    </tr>
  );
}

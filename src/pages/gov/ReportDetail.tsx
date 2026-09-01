import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileBarChart2 } from "lucide-react";
import { PageContainer, SectionCard, StatusBadge, ComplianceScore, Button } from "../../components/ui";
import { AuditReportTable } from "../../components/intel/AuditReport";
import { AuditTrail } from "../../components/intel/AuditTrail";
import { ProcessingSequence, useProcessingRun } from "../../components/intel/ProcessingSequence";
import { countResults, getRequirements, getTenderIntelligence } from "../../data/intelligenceData";
import { tenders, formatINR } from "../../data/mockData";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const reportSteps = [
  { id: "collect", label: "Collecting evaluated requirements", description: "Reading rule results for the selected bidder" },
  { id: "evidence", label: "Attaching evidence references", description: "Document name and page for every result" },
  { id: "review", label: "Adding review decisions", description: "Officer actions recorded during evaluation" },
  { id: "compose", label: "Composing audit report", description: "Assembling the evaluation trail" },
];

export default function GovReportDetail() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const { bidsState } = useApp();
  const tender = tenders.find((t) => t.id === decodeURIComponent(id ?? ""));
  const relatedBids = bidsState.filter((b) => b.tenderId === tender?.id);
  const approved = relatedBids.find((b) => b.status === "Approved");

  const requirements = getRequirements(tender?.id);
  const intelligence = getTenderIntelligence(tender?.id);
  const requestedBidder = params.get("bidder");
  const [selectedBidderId, setSelectedBidderId] = useState<string | null>(
    requestedBidder ?? intelligence[0]?.bidderId ?? null
  );
  const selected = intelligence.find((i) => i.bidderId === selectedBidderId) ?? null;
  const run = useProcessingRun(reportSteps.length, 520, requestedBidder ? "done" : "idle");

  if (!tender) {
    return <PageContainer><p>Report not found.</p></PageContainer>;
  }

  const selectBidder = (bidderId: string) => {
    setSelectedBidderId(bidderId);
    params.set("bidder", bidderId);
    setParams(params, { replace: true });
  };

  const counts = selected ? countResults(selected.results, requirements) : null;
  const selectedBid = relatedBids.find((b) => b.bidderId === selectedBidderId);

  return (
    <PageContainer>
      <Link to="/gov/reports" className="text-sm font-medium text-[#3d2b1f] underline">← Back to Reports</Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{tender.title} — Compliance Report</h1>
      <p className="mt-2 font-mono text-sm text-[#8a7c68]">{tender.id}</p>

      <SectionCard className="mt-6">
        <h2 className="text-lg font-semibold">Tender Information</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Department", tender.department],
            ["Category", tender.category],
            ["Published", tender.publishedDate],
            ["Closing Date", tender.closingDate],
            ["Evaluation Date", tender.evaluationDate],
            ["Decision Date", tender.decisionDate],
          ].map(([label, value]) => (
            <div key={label}><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard className="mt-6">
        <h2 className="text-lg font-semibold">Bidder Compliance Results</h2>
        <div className="mt-4 space-y-4">
          {relatedBids.map((b) => (
            <div key={b.id} className="flex flex-col justify-between gap-4 rounded-md border border-[#e5ded1] p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium text-[#3d2b1f]">{b.bidderName}</p>
                <p className="text-sm text-[#6b5c4a]">{formatINR(b.quotation.finalAmount)} · {b.documentsComplete} documents</p>
                <p className="mt-2 text-sm text-[#5b4a3a]">{b.aiAssessment.summary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <ComplianceScore value={b.compliance} size="sm" />
                <StatusBadge status={b.status === "Approved" ? "verified" : b.status === "Rejected" ? "failed" : "pending"} label={b.status} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {intelligence.length > 0 && (
        <SectionCard className="mt-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FileBarChart2 size={18} className="text-[#8a5a35]" /> Audit Report
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[#6b5c4a]">
                An auditable evaluation trail: every requirement, the rule applied, the bidder value, the result, the
                evidence page it came from and the review decision.
              </p>
            </div>
            <Button
              variant={run.state === "done" ? "secondary" : "primary"}
              onClick={run.start}
              disabled={run.state === "running" || !selected}
              className="shrink-0"
            >
              {run.state === "idle" ? "Generate Compliance Report" : run.state === "running" ? "Generating…" : "Regenerate"}
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {intelligence.map((intel) => (
              <button
                key={intel.bidderId}
                onClick={() => selectBidder(intel.bidderId)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  selectedBidderId === intel.bidderId
                    ? "border-[#3d2b1f] bg-[#3d2b1f] text-white"
                    : "border-[#d8cfc2] bg-white text-[#5b4a3a] hover:bg-[#f7f3ec]"
                )}
              >
                {intel.bidderName}
              </button>
            ))}
          </div>

          {run.state === "running" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              <ProcessingSequence steps={reportSteps} currentStep={run.currentStep} state={run.state} title="Preparing report" />
            </motion.div>
          )}

          {run.state === "done" && selected && counts && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
              <div className="rounded-lg border border-[#e5ded1] bg-[#faf8f4] p-5">
                <h3 className="text-base font-semibold text-[#3d2b1f]">Bidder Information</h3>
                <dl className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className="text-xs uppercase tracking-wide text-[#a4977f]">Bidder</dt><dd className="mt-1 text-sm font-medium">{selected.bidderName}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wide text-[#a4977f]">Quotation</dt><dd className="mt-1 text-sm">{selectedBid ? formatINR(selectedBid.quotation.finalAmount) : "—"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wide text-[#a4977f]">Requirements Evaluated</dt><dd className="mt-1 text-sm">{counts.total}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wide text-[#a4977f]">Analysis Completed</dt><dd className="mt-1 text-sm">{selected.analysedAt}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <span className="text-[#2f6b3a]">✓ {counts.compliant} compliant</span>
                  <span className="text-[#9c6b1a]">⚠ {counts.needsReview} needs review</span>
                  <span className="text-[#9c3131]">✕ {counts.nonCompliant} non-compliant</span>
                  <span className="text-[#7a6a55]">○ {counts.missing} missing</span>
                  <span className={counts.criticalFailures ? "font-semibold text-[#9c3131]" : "text-[#5b4a3a]"}>
                    {counts.criticalFailures} critical failure{counts.criticalFailures === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <AuditReportTable requirements={requirements} results={selected.results} />

              <AuditTrail entries={selected.audit} title="Decision History" />
            </motion.div>
          )}
        </SectionCard>
      )}

      <SectionCard className="mt-6">
        <h2 className="text-lg font-semibold">Officer Review & Final Decision</h2>
        {approved ? (
          <p className="mt-3 text-sm text-[#2f6b3a]">
            <span className="font-semibold">{approved.bidderName}</span> was approved for this tender with a compliance score of {approved.compliance}% and a final quotation of {formatINR(approved.quotation.finalAmount)}.
          </p>
        ) : (
          <p className="mt-3 text-sm text-[#6b5c4a]">Final decision pending. Officer evaluation is in progress.</p>
        )}
      </SectionCard>
    </PageContainer>
  );
}

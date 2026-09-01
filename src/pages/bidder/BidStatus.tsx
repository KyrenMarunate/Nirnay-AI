import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, XCircle, PartyPopper, FileX } from "lucide-react";
import { PageContainer, SectionCard, ComplianceScore, Timeline, Button } from "../../components/ui";
import { ComplianceOverview, RequirementResultList } from "../../components/intel/ComplianceOverview";
import { RequirementDrawer } from "../../components/intel/RequirementDrawer";
import { getIntelligence, getRequirements } from "../../data/intelligenceData";
import { useApp } from "../../context/AppContext";
import { tenders, formatINR } from "../../data/mockData";

const statusMeta: Record<string, { label: string; color: string }> = {
  "Under Government Review": { label: "Under Government Review", color: "#3a5a9c" },
  "Action Required": { label: "Action Required", color: "#9c6b1a" },
  Approved: { label: "Approved", color: "#2f6b3a" },
  Rejected: { label: "Rejected", color: "#9c3131" },
  Flagged: { label: "Flagged for Review", color: "#9c3131" },
  Submitted: { label: "Submitted", color: "#3a5a9c" },
  Draft: { label: "Draft", color: "#8a7c68" },
};

export default function BidStatus() {
  const { bidId } = useParams();
  const { bidsState } = useApp();
  const bid = bidsState.find((b) => b.id === bidId);
  const tender = tenders.find((t) => t.id === bid?.tenderId);
  const [openRequirementId, setOpenRequirementId] = useState<string | null>(null);

  const requirements = getRequirements(bid?.tenderId);
  const intel = getIntelligence(bid?.tenderId, bid?.bidderId);

  if (!bid || !tender) {
    return (
      <PageContainer>
        <p>Bid not found.</p>
        <Link to="/bidder/bids" className="text-sm underline">Back to My Bids</Link>
      </PageContainer>
    );
  }

  const meta = statusMeta[bid.status];

  const timelineSteps = (() => {
    if (bid.status === "Approved" || bid.status === "Rejected") {
      return [
        { label: "Bid Submitted", state: "done" as const },
        { label: "Compliance Verification", state: "done" as const },
        { label: "Officer Evaluation", state: "done" as const },
        { label: bid.status === "Approved" ? "Bidder Selected" : "Final Decision", state: "done" as const },
      ];
    }
    return [
      { label: "Bid Submitted", state: "done" as const },
      { label: "Initial Compliance Check", state: "done" as const },
      { label: "Government Evaluation", state: "current" as const },
      { label: "Final Decision", state: "upcoming" as const },
    ];
  })();

  return (
    <PageContainer className="max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Bid Status</h1>
      <p className="mt-2 text-[#6b5c4a]">{tender.title} · <span className="font-mono">{tender.id}</span></p>

      <SectionCard className="mt-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Current Status</p>
        <p className="mt-2 text-2xl font-semibold" style={{ color: meta.color }}>{meta.label}</p>
      </SectionCard>

      {bid.status === "Approved" && (
        <SectionCard className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf3ea]">
            <PartyPopper size={26} className="text-[#2f6b3a]" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Bid Approved</h2>
          <p className="mt-2 text-sm text-[#6b5c4a]">
            Congratulations. Your bid for <strong>{tender.title}</strong> has been approved by the procurement authority.
          </p>
          <p className="mt-3 font-mono text-xs text-[#8a7c68]">Submission ID: {bid.submissionId}</p>
        </SectionCard>
      )}

      {bid.status === "Rejected" && (
        <SectionCard className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8e9e9]">
            <FileX size={26} className="text-[#9c3131]" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Bid Not Selected</h2>
          <p className="mt-2 text-sm text-[#6b5c4a]">{bid.reasonForDecision ?? "The submitted bid did not satisfy the required eligibility criteria."}</p>
          <p className="mt-3 font-mono text-xs text-[#8a7c68]">Submission ID: {bid.submissionId}</p>
        </SectionCard>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr]">
        <SectionCard className="flex flex-col items-center justify-center gap-2 text-center">
          <ComplianceScore value={bid.compliance} size="lg" />
          <p className="text-xs text-[#8a7c68]">Compliance Score</p>
        </SectionCard>
        <SectionCard>
          <h2 className="text-lg font-semibold">Submission Details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Submission ID</dt><dd className="mt-1 font-mono">{bid.submissionId}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Submitted</dt><dd className="mt-1">{bid.submittedDate ?? "—"}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Quotation</dt><dd className="mt-1">{formatINR(bid.quotation.finalAmount)}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Documents</dt><dd className="mt-1">{bid.documentsComplete}</dd></div>
          </dl>
        </SectionCard>
      </div>

      {intel && requirements.length > 0 && (
        <div className="mt-8 space-y-5">
          <ComplianceOverview
            requirements={requirements}
            results={intel.results}
            score={intel.overallScore}
            title="Requirement Assessment"
            description={`How each of the ${requirements.length} tender requirements was evaluated against your submission, with the evidence used.`}
            onOpenRequirement={setOpenRequirementId}
          />
          <RequirementResultList
            requirements={requirements}
            results={intel.results}
            onOpenRequirement={setOpenRequirementId}
          />
        </div>
      )}

      <SectionCard className="mt-6">
        <h2 className="text-lg font-semibold">Timeline</h2>
        <div className="mt-4"><Timeline steps={timelineSteps} /></div>
      </SectionCard>

      {(bid.warnings.length > 0 || bid.status === "Rejected" || bid.status === "Flagged" || bid.status === "Action Required") && (
        <SectionCard className="mt-6">
          <h2 className="text-lg font-semibold">Review Findings</h2>
          <p className="mt-1 text-sm text-[#6b5c4a]">Understand what was flagged and why, so you know exactly what to address.</p>
          <div className="mt-4 space-y-3">
            {bid.warnings.map((w) => (
              <div key={w.title} className="flex items-start gap-3 rounded-md border border-[#f0dcb2] bg-[#fbf1e0] p-4">
                {w.severity === "issue" ? <XCircle size={18} className="mt-0.5 shrink-0 text-[#9c3131]" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#9c6b1a]" />}
                <div>
                  <p className="text-sm font-semibold text-[#3d2b1f]">{w.title}</p>
                  <p className="mt-1 text-sm text-[#6b5c4a]">{w.detail}</p>
                </div>
              </div>
            ))}
            {bid.complianceItems.filter((c) => c.status === "verified").slice(0, 2).map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-md border border-[#c9e2cb] bg-[#eaf3ea] p-4">
                <CheckCircle2 size={18} className="text-[#2f6b3a]" />
                <p className="text-sm font-medium text-[#2f6b3a]">{c.label} — Compliant</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <div className="mt-8 flex justify-center">
        <Link to="/bidder/bids"><Button variant="secondary">Back to My Bids</Button></Link>
      </div>

      <RequirementDrawer
        open={openRequirementId !== null}
        onClose={() => setOpenRequirementId(null)}
        requirement={requirements.find((r) => r.id === openRequirementId) ?? null}
        result={intel?.results.find((r) => r.requirementId === openRequirementId) ?? null}
        bidderName={bid.bidderName}
      />
    </PageContainer>
  );
}

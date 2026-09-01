import { Link } from "react-router-dom";
import { PageContainer, SectionCard, ComplianceScore, EmptyState, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { tenders, formatINR } from "../../data/mockData";

const statusStyles: Record<string, string> = {
  Draft: "bg-[#f1ece2] text-[#7a6a55] border-[#e0d6c5]",
  Submitted: "bg-[#eef2fb] text-[#3a5a9c] border-[#cdd9f0]",
  "Under Government Review": "bg-[#eef2fb] text-[#3a5a9c] border-[#cdd9f0]",
  "Action Required": "bg-[#fbf1e0] text-[#9c6b1a] border-[#f0dcb2]",
  Approved: "bg-[#eaf3ea] text-[#2f6b3a] border-[#c9e2cb]",
  Rejected: "bg-[#f8e9e9] text-[#9c3131] border-[#f0c9c9]",
  Flagged: "bg-[#f8e9e9] text-[#9c3131] border-[#f0c9c9]",
};

export default function MyBids() {
  const { bidsState, currentCompany } = useApp();
  const myBids = bidsState.filter((b) => b.bidderId === currentCompany?.id);

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">My Bids</h1>
      <p className="mt-2 text-[#6b5c4a]">Track the status of every bid your organization has submitted.</p>

      <div className="mt-8 flex flex-col gap-4">
        {myBids.length === 0 && <EmptyState title="No bids submitted" description="Browse available tenders to submit your first bid." />}
        {myBids.map((bid) => {
          const tender = tenders.find((t) => t.id === bid.tenderId);
          return (
            <SectionCard key={bid.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-[#3d2b1f]">{tender?.title ?? bid.tenderId}</p>
                <p className="mt-1 font-mono text-xs text-[#8a7c68]">Bid ID: {bid.tenderId} · Submission: {bid.submissionId}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[bid.status]}`}>{bid.status}</span>
                  <span className="text-sm text-[#6b5c4a]">Quotation: {formatINR(bid.quotation.finalAmount)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ComplianceScore value={bid.compliance} size="sm" />
                <Link to={`/bidder/bids/${bid.id}`}>
                  <Button variant="secondary" size="sm">View Status</Button>
                </Link>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </PageContainer>
  );
}

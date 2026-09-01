import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { PageContainer, SectionCard, ComplianceScore, Button, EmptyState } from "../../components/ui";
import { useApp } from "../../context/AppContext";

const statusStyles: Record<string, string> = {
  Draft: "text-[#8a7c68]",
  Submitted: "text-[#3a5a9c]",
  "Under Government Review": "text-[#3a5a9c]",
  "Action Required": "text-[#9c6b1a]",
  Approved: "text-[#2f6b3a]",
  Rejected: "text-[#9c3131]",
  Flagged: "text-[#9c3131]",
};

export default function BidderOverview() {
  const { currentCompany, bidsState } = useApp();
  const myBids = bidsState.filter((b) => b.bidderId === currentCompany?.id);

  return (
    <PageContainer>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Bidder Portal</h1>
          <p className="mt-2 text-[#6b5c4a]">Welcome, <span className="font-medium text-[#3d2b1f]">{currentCompany?.name}</span></p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#c9e2cb] bg-[#eaf3ea] px-3.5 py-1.5 text-sm font-medium text-[#2f6b3a]">
          <ShieldCheck size={16} />
          {currentCompany?.overallVerified ? "Organization Verified" : "Verification Pending"}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Current Bids</h2>
        <Link to="/bidder/bids" className="text-sm font-medium text-[#3d2b1f] inline-flex items-center gap-1">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {myBids.length === 0 && (
          <EmptyState title="No bids yet" description="Browse available tenders to submit your first bid." />
        )}
        {myBids.map((bid) => (
          <SectionCard key={bid.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#3d2b1f]">{bid.tenderId === "GEM/2026/B/458921" ? "Supply of Medical Equipment" : bid.tenderId === "GEM/2026/B/458774" ? "IT Infrastructure Modernization" : bid.tenderId}</p>
              <p className="mt-1 font-mono text-xs text-[#8a7c68]">Bid ID: {bid.tenderId}</p>
              <p className={`mt-3 text-sm font-medium ${statusStyles[bid.status]}`}>
                {bid.status === "Action Required" ? "⚠ Action Required" : bid.status}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ComplianceScore value={bid.compliance} size="sm" />
              <Link to={`/bidder/bids/${bid.id}`}>
                <Button variant="ghost" size="sm">Details</Button>
              </Link>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-[#e5ded1] bg-[#f6f1e8] p-8 text-center">
        <p className="text-lg font-semibold">Looking for new opportunities?</p>
        <p className="mt-1 text-sm text-[#6b5c4a]">Browse currently open government tenders relevant to your business category.</p>
        <Link to="/bidder/tenders">
          <Button className="mt-5">Available Government Tenders <ArrowRight size={16} /></Button>
        </Link>
      </div>
    </PageContainer>
  );
}

import { PageContainer, SectionCard, ComplianceScore, StatusBadge } from "../../components/ui";
import { BidReadinessPanel } from "../../components/intel/BidReadinessPanel";
import { ConsistencyCheck } from "../../components/intel/ConsistencyCheck";
import { bidReadiness } from "../../data/intelligenceData";
import { useApp } from "../../context/AppContext";
import { tenders } from "../../data/mockData";

export default function BidderCompliance() {
  const { bidsState, currentCompany } = useApp();
  const myBids = bidsState.filter((b) => b.bidderId === currentCompany?.id);
  const avg = myBids.length ? Math.round(myBids.reduce((a, b) => a + b.compliance, 0) / myBids.length) : 0;

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Compliance</h1>
      <p className="mt-2 text-[#6b5c4a]">
        Run a pre-submission readiness check on the bid you are preparing, and review how your submitted bids are
        performing.
      </p>

      <div className="mt-8">
        <BidReadinessPanel data={bidReadiness} />
      </div>

      <div className="mt-10">
        <ConsistencyCheck
          fields={bidReadiness.consistency}
          findings={bidReadiness.findings}
          description="NirnayAI compares the values in your own documents. Fixing mismatches here prevents clarification requests later."
        />
      </div>

      <h2 className="mt-12 text-xl font-semibold">Submitted Bid Performance</h2>

      <SectionCard className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <ComplianceScore value={avg} size="lg" />
        <div>
          <p className="text-lg font-semibold">Average Compliance Score (secondary metric)</p>
          <p className="mt-1 text-sm text-[#6b5c4a]">Calculated across {myBids.length} submitted bid{myBids.length !== 1 ? "s" : ""}.</p>
        </div>
      </SectionCard>

      <div className="mt-8 space-y-6">
        {myBids.map((bid) => {
          const tender = tenders.find((t) => t.id === bid.tenderId);
          return (
            <SectionCard key={bid.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#3d2b1f]">{tender?.title ?? bid.tenderId}</p>
                  <p className="text-xs text-[#8a7c68]">{bid.tenderId}</p>
                </div>
                <ComplianceScore value={bid.compliance} size="sm" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {bid.complianceItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-3 py-2">
                    <span className="text-xs font-medium text-[#3d2b1f]">{item.label}</span>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </PageContainer>
  );
}

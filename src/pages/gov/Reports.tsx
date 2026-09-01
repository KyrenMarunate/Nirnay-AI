import { Link } from "react-router-dom";
import { PageContainer, Button, DataTable } from "../../components/ui";
import { tenders } from "../../data/mockData";
import { countResults, getRequirements, getTenderIntelligence } from "../../data/intelligenceData";
import { useApp } from "../../context/AppContext";

export default function GovReports() {
  const { bidsState } = useApp();

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Compliance Reports</h1>
      <p className="mt-2 text-[#6b5c4a]">
        Auditable compliance reports: every requirement, the rule applied, the extracted value, the evidence page and the
        officer's decision.
      </p>

      <div className="mt-8">
        <DataTable
          rows={tenders}
          getRowKey={(tender) => tender.id}
          columns={[
            {
              key: "title",
              header: "Tender",
              className: "min-w-[260px]",
              render: (tender) => (
                <div>
                  <p className="font-medium text-[#3d2b1f]">{tender.title}</p>
                  <p className="font-mono text-xs text-[#8a7c68]">{tender.id}</p>
                </div>
              ),
            },
            {
              key: "bidders",
              header: "Bidders",
              className: "min-w-[90px]",
              render: (tender) => bidsState.filter((b) => b.tenderId === tender.id).length,
            },
            {
              key: "requirements",
              header: "Requirements",
              className: "min-w-[130px]",
              render: (tender) => {
                const reqs = getRequirements(tender.id);
                return reqs.length ? `${reqs.length} evaluated` : "—";
              },
            },
            {
              key: "avgCompliance",
              header: "Avg. Compliance",
              className: "min-w-[140px]",
              render: (tender) => {
                const relatedBids = bidsState.filter((b) => b.tenderId === tender.id);
                const avg = relatedBids.length ? Math.round(relatedBids.reduce((a, b) => a + b.compliance, 0) / relatedBids.length) : 0;
                return relatedBids.length ? `${avg}%` : "—";
              },
            },
            {
              key: "issues",
              header: "Exceptions",
              className: "min-w-[180px]",
              render: (tender) => {
                const reqs = getRequirements(tender.id);
                const intel = getTenderIntelligence(tender.id);
                if (!reqs.length || !intel.length) {
                  return bidsState.filter((b) => b.tenderId === tender.id).reduce((a, b) => a + b.warnings.length, 0) || "—";
                }
                const totals = intel.reduce(
                  (acc, bidder) => {
                    const c = countResults(bidder.results, reqs);
                    return {
                      critical: acc.critical + c.criticalFailures,
                      review: acc.review + c.needsReview,
                    };
                  },
                  { critical: 0, review: 0 }
                );
                return (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className={totals.critical ? "font-semibold text-[#9c3131]" : "text-[#6b5c4a]"}>
                      ✕ {totals.critical} critical
                    </span>
                    <span className={totals.review ? "font-semibold text-[#9c6b1a]" : "text-[#6b5c4a]"}>
                      ⚠ {totals.review} review
                    </span>
                  </span>
                );
              },
            },
            {
              key: "status",
              header: "Review Status",
              className: "min-w-[150px]",
              render: (tender) => {
                const relatedBids = bidsState.filter((b) => b.tenderId === tender.id);
                return relatedBids.some((b) => b.status === "Approved") ? "Completed" : relatedBids.length ? "In Progress" : "Awaiting Bids";
              },
            },
            {
              key: "action",
              header: "",
              className: "w-[130px] text-right",
              render: (tender) => (
                <Link to={`/gov/reports/${encodeURIComponent(tender.id)}`}>
                  <Button variant="ghost" size="sm">
                    {getRequirements(tender.id).length ? "Generate Report" : "View Report"}
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      </div>
    </PageContainer>
  );
}

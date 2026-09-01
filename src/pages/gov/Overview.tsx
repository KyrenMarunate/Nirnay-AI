import { Link } from "react-router-dom";
import { PageContainer, TenderStatusBadge, Button, DataTable } from "../../components/ui";
import { RiskOverviewPanel } from "../../components/intel/RiskOverviewPanel";
import { ServicesHub } from "../../components/intel/ServicesHub";
import { aggregateRisk, getReviewQueue } from "../../data/intelligenceData";
import { tenders, govMetrics } from "../../data/mockData";

/** Tender currently under active AI evaluation in this demo. */
const focusTenderId = "GEM/2026/B/458921";

export default function GovOverview() {
  const focusRisk = aggregateRisk(focusTenderId);
  const reviewQueue = getReviewQueue(focusTenderId);
  const focusTender = tenders.find((t) => t.id === focusTenderId);

  const metrics = [
    { label: "Active Tenders", value: govMetrics.activeTenders },
    { label: "Bids Awaiting Review", value: govMetrics.bidsAwaitingReview },
    { label: "Critical Exceptions", value: focusRisk.criticalExceptions },
    { label: "Awaiting Human Review", value: reviewQueue.length },
  ];

  const tenderRows = tenders.map((t) => ({
    ...t,
    titleCell: (
      <div>
        <p className="font-semibold text-[#3d2b1f]">{t.title}</p>
        <p className="mt-1 font-mono text-[11px] text-[#8a7c68]">{t.id}</p>
      </div>
    ),
  }));

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight text-[#211b17]">Procurement Overview</h1>
      <p className="mt-2 text-[#6b5c4a]">Monitor active tenders, submitted bids and compliance reviews.</p>

      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-[#e5ded1] bg-[#e5ded1] lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-6">
            <p className="text-3xl font-semibold tracking-tight text-[#3d2b1f]">{m.value}</p>
            <p className="mt-1 text-sm text-[#6b5c4a]">{m.label}</p>
          </div>
        ))}
      </div>

      {focusTender && (
        <div className="mt-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#211b17]">Priority Attention</h2>
              <p className="mt-1 text-sm text-[#6b5c4a]">
                Exceptions raised while evaluating {focusTender.title}.
              </p>
            </div>
            <Link
              to={`/gov/tenders/${encodeURIComponent(focusTenderId)}`}
              className="text-sm font-medium text-[#3d2b1f] underline"
            >
              Open tender review
            </Link>
          </div>
          <RiskOverviewPanel
            risk={focusRisk}
            scopeLabel={`${focusTender.id} · evidence-linked exceptions across submitted bids`}
            priorityLink={`/gov/tenders/${encodeURIComponent(focusTenderId)}`}
            compact
          />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#211b17]">Active Tenders</h2>
        <Link to="/gov/tenders" className="text-sm font-medium text-[#3d2b1f]">View all</Link>
      </div>

      <div className="mt-4">
        <DataTable
          rows={tenderRows}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: "titleCell",
              header: "Tender",
              className: "min-w-[260px]",
              render: (row) => row.titleCell,
            },
            { key: "ministry", header: "Department", className: "min-w-[220px]" },
            { key: "bidsCount", header: "Bids", className: "min-w-[74px] text-[#3d2b1f]" },
            { key: "closingDate", header: "Deadline", className: "min-w-[130px] text-[#3d2b1f]" },
            {
              key: "status",
              header: "Status",
              className: "min-w-[170px]",
              render: (row) => <TenderStatusBadge status={row.status} />,
            },
            {
              key: "action",
              header: "",
              className: "w-[120px] text-right",
              render: (row) => (
                <Link to={`/gov/tenders/${encodeURIComponent(row.id)}`}>
                  <Button variant="ghost" size="sm" className="text-[#3d2b1f] hover:bg-[#f3ebdf] hover:text-[#3d2b1f]">
                    Review
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-10">
        <ServicesHub />
      </div>
    </PageContainer>
  );
}

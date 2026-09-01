import { Link } from "react-router-dom";
import { PageContainer, TenderStatusBadge, Button } from "../../components/ui";
import { tenders } from "../../data/mockData";
import { countResults, getRequirements, getTenderIntelligence } from "../../data/intelligenceData";

export default function ReviewTenders() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Review Tenders</h1>
      <p className="mt-2 text-[#6b5c4a]">Select a tender to review submitted bids and manage evaluation.</p>

      <div className="mt-8 flex flex-col gap-4">
        {tenders.map((t) => {
          const reqs = getRequirements(t.id);
          const intel = getTenderIntelligence(t.id);
          const totals = intel.reduce(
            (acc, bidder) => {
              const c = countResults(bidder.results, reqs);
              return { critical: acc.critical + c.criticalFailures, review: acc.review + c.needsReview };
            },
            { critical: 0, review: 0 }
          );
          return (
          <div key={t.id} className="rounded-lg border border-[#e5ded1] bg-white p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{t.title}</h3>
                  <TenderStatusBadge status={t.status} />
                </div>
                <p className="mt-1 text-sm text-[#6b5c4a]">{t.ministry}</p>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#8a7c68]">
                  <div className="flex gap-1"><dt className="font-medium text-[#5b4a3a]">Tender ID:</dt><dd className="font-mono">{t.id}</dd></div>
                  <div className="flex gap-1"><dt className="font-medium text-[#5b4a3a]">Bids Received:</dt><dd>{t.bidsCount}</dd></div>
                  <div className="flex gap-1"><dt className="font-medium text-[#5b4a3a]">Closing:</dt><dd>{t.closingDate}</dd></div>
                </dl>

                {reqs.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                    <span className="rounded-full border border-[#e5ded1] bg-[#f7f3ec] px-2.5 py-1 font-medium text-[#5b4a3a]">
                      {reqs.length} requirements extracted
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-medium ${
                        totals.critical
                          ? "border-[#f0c9c9] bg-[#f8e9e9] text-[#9c3131]"
                          : "border-[#c9e2cb] bg-[#eaf3ea] text-[#2f6b3a]"
                      }`}
                    >
                      ✕ {totals.critical} critical {totals.critical === 1 ? "failure" : "failures"}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-medium ${
                        totals.review
                          ? "border-[#f0dcb2] bg-[#fbf1e0] text-[#9c6b1a]"
                          : "border-[#e5ded1] bg-[#f7f3ec] text-[#6b5c4a]"
                      }`}
                    >
                      ⚠ {totals.review} awaiting human review
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-[#8a7c68]">
                    Requirements not extracted yet — open the tender and run AI Tender Analysis.
                  </p>
                )}
              </div>
              <Link to={`/gov/tenders/${encodeURIComponent(t.id)}`} className="shrink-0">
                <Button variant="secondary">Review Tender</Button>
              </Link>
            </div>
          </div>
          );
        })}
      </div>
    </PageContainer>
  );
}

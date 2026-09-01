import { Link } from "react-router-dom";
import { PageContainer, ComplianceScore, StatusBadge, SectionCard } from "../../components/ui";
import { StatusPill } from "../../components/intel/primitives";
import { countResults, getRequirements, getReviewQueue, getTenderIntelligence } from "../../data/intelligenceData";
import { tenders } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

const focusTenderId = "GEM/2026/B/458921";

export default function GovCompliance() {
  const { bidsState } = useApp();
  const avg = bidsState.length ? Math.round(bidsState.reduce((a, b) => a + b.compliance, 0) / bidsState.length) : 0;
  const flaggedBids = bidsState.filter((b) => b.warnings.length > 0);

  const requirements = getRequirements(focusTenderId);
  const intelligence = getTenderIntelligence(focusTenderId);
  const reviewQueue = getReviewQueue(focusTenderId);
  const exceptions = intelligence.flatMap((intel) =>
    intel.results
      .filter((result) => {
        const req = requirements.find((r) => r.id === result.requirementId);
        return req?.mandatory && (result.status === "non-compliant" || result.status === "missing");
      })
      .map((result) => ({
        intel,
        result,
        requirement: requirements.find((r) => r.id === result.requirementId)!,
      }))
  );

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Compliance</h1>
      <p className="mt-2 text-[#6b5c4a]">Platform-wide compliance performance across all submitted bids.</p>

      {intelligence.length > 0 && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-[#e5ded1] bg-[#e5ded1] lg:grid-cols-4">
            {[
              ["Requirements Evaluated", intelligence.reduce((total, i) => total + countResults(i.results, requirements).total, 0), "text-[#3d2b1f]"],
              ["Compliant", intelligence.reduce((total, i) => total + countResults(i.results, requirements).compliant, 0), "text-[#2f6b3a]"],
              ["Critical Failures", exceptions.length, "text-[#9c3131]"],
              ["Awaiting Human Review", reviewQueue.length, "text-[#9c6b1a]"],
            ].map(([label, value, tone]) => (
              <div key={label as string} className="bg-white p-5">
                <p className={`text-2xl font-semibold tracking-tight ${tone}`}>{value}</p>
                <p className="mt-1 text-sm text-[#6b5c4a]">{label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-semibold">Critical Exceptions</h2>
          <p className="mt-1 text-sm text-[#6b5c4a]">
            Mandatory requirements that are not satisfied. These stay visible regardless of a bidder's overall score.
          </p>
          <div className="mt-4 space-y-3">
            {exceptions.map(({ intel, result, requirement }) => (
              <SectionCard key={`${intel.bidderId}-${requirement.id}`} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium text-[#3d2b1f]">
                    {requirement.name} — {intel.bidderName}
                  </p>
                  <p className="mt-1 text-sm text-[#6b5c4a]">
                    Required {requirement.rule} · Bidder evidence: {result.bidderValue}
                  </p>
                  {result.evidence && (
                    <p className="mt-1 text-xs text-[#8a7c68]">
                      {result.evidence.document} — Page {result.evidence.page}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill status={result.status} />
                  <Link
                    to={`/gov/tenders/${encodeURIComponent(intel.tenderId)}/bidders/${intel.bidderId}`}
                    className="text-sm font-medium text-[#3d2b1f] underline"
                  >
                    Review
                  </Link>
                </div>
              </SectionCard>
            ))}
            {exceptions.length === 0 && (
              <p className="text-sm text-[#8a7c68]">No mandatory requirement failures recorded.</p>
            )}
          </div>
        </>
      )}

      <SectionCard className="mt-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <ComplianceScore value={avg} size="lg" />
        <div>
          <p className="text-lg font-semibold">Average Bid Compliance (secondary metric)</p>
          <p className="mt-1 text-sm text-[#6b5c4a]">
            Calculated across {bidsState.length} submitted bids across all tenders. A high average never hides the
            mandatory failures listed above.
          </p>
        </div>
      </SectionCard>

      <h2 className="mt-10 text-xl font-semibold">Bids Requiring Attention</h2>
      <div className="mt-4 space-y-4">
        {flaggedBids.map((b) => {
          const tender = tenders.find((t) => t.id === b.tenderId);
          return (
            <SectionCard key={b.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium text-[#3d2b1f]">{b.bidderName}</p>
                <p className="text-sm text-[#6b5c4a]">{tender?.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.warnings.map((w) => (
                    <StatusBadge key={w.title} status={w.severity === "issue" ? "failed" : "warning"} label={w.title} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ComplianceScore value={b.compliance} size="sm" />
                {tender && (
                  <Link to={`/gov/tenders/${encodeURIComponent(tender.id)}/bidders/${b.bidderId}`} className="text-sm font-medium text-[#3d2b1f] underline">
                    Review
                  </Link>
                )}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </PageContainer>
  );
}

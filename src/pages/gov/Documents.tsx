import { Link } from "react-router-dom";
import { FileText, FileX2 } from "lucide-react";
import { PageContainer, StatusBadge, Button, SectionCard } from "../../components/ui";
import { bidderIntelligence } from "../../data/intelligenceData";
import { companies, tenders } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function GovDocuments() {
  const { bidsState } = useApp();
  const flagged = companies.flatMap((c) =>
    c.documents.filter((d) => d.status === "warning" || d.status === "failed").map((d) => ({ ...d, company: c }))
  );

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Document Verification</h1>
      <p className="mt-2 text-[#6b5c4a]">Missing mandatory documents and documents flagged by the AI cross-check.</p>

      {(() => {
        const missing = bidderIntelligence.flatMap((intel) =>
          intel.documents.filter((d) => d.status === "missing" && d.mandatory).map((d) => ({ intel, doc: d }))
        );
        if (missing.length === 0) return null;
        return (
          <div className="mt-8 rounded-[20px] border border-[#f0c9c9] bg-[#fdf4f4] p-5">
            <h2 className="text-lg font-semibold text-[#9c3131]">
              {missing.length} Mandatory Document{missing.length > 1 ? "s" : ""} Missing
            </h2>
            <p className="mt-1 text-sm text-[#7a2b2b]">
              Detected by comparing each submission against the documents the tender requires.
            </p>
            <div className="mt-4 space-y-3">
              {missing.map(({ intel, doc }) => (
                <div
                  key={`${intel.bidderId}-${doc.label}`}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-[#f0c9c9] bg-white p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-[#f8e9e9] text-[#9c3131]">
                      <FileX2 size={16} />
                    </span>
                    <div>
                      <p className="font-medium text-[#3d2b1f]">{doc.label} — Missing</p>
                      <p className="text-xs text-[#8a7c68]">{intel.bidderName}</p>
                      {doc.note && <p className="mt-1 text-sm text-[#6b5c4a]">{doc.note}</p>}
                    </div>
                  </div>
                  <Link
                    to={`/gov/tenders/${encodeURIComponent(intel.tenderId)}/bidders/${intel.bidderId}`}
                    className="shrink-0"
                  >
                    <Button variant="secondary" size="sm">Open Submission</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="mt-8 space-y-4">
        {flagged.map((doc) => {
          const bid = bidsState.find((b) => b.bidderId === doc.company.id);
          const tender = tenders.find((t) => t.id === bid?.tenderId);
          return (
            <SectionCard key={`${doc.company.id}-${doc.id}`}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-[#f1ece2] text-[#3d2b1f]"><FileText size={16} /></span>
                  <div>
                    <p className="font-medium text-[#3d2b1f]">{doc.type}</p>
                    <p className="text-xs text-[#8a7c68]">{doc.company.name} · {doc.name}</p>
                    {doc.aiNote && <p className="mt-1 max-w-md text-sm text-[#6b5c4a]">{doc.aiNote}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={doc.status} />
                  {tender && (
                    <Link to={`/gov/tenders/${encodeURIComponent(tender.id)}/bidders/${doc.company.id}`}>
                      <Button variant="secondary" size="sm">Inspect</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SectionCard>
          );
        })}
        {flagged.length === 0 && <p className="text-sm text-[#8a7c68]">No documents currently require review.</p>}
      </div>
    </PageContainer>
  );
}

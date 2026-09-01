import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { PageContainer, SectionCard, StatusBadge, Button } from "../../components/ui";
import { DocumentCompleteness } from "../../components/intel/DocumentCompleteness";
import { bidReadiness } from "../../data/intelligenceData";
import { useApp } from "../../context/AppContext";

export default function BidderDocuments() {
  const { currentCompany } = useApp();
  const [docs, setDocs] = useState(currentCompany?.documents ?? []);
  const [uploadedMissing, setUploadedMissing] = useState(false);

  const checklist = bidReadiness.checklist.map((item) =>
    uploadedMissing && item.status === "missing"
      ? { ...item, status: "present" as const, fileName: "OEM_Authorization_Letter.pdf", note: undefined }
      : item
  );

  if (!currentCompany) return null;

  const simulateUpload = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status: "pending", uploadDate: "Just now" } : d)));
    setTimeout(() => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status: "verified", confidence: 95 } : d)));
    }, 1400);
  };

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Organization Documents</h1>
      <p className="mt-2 text-[#6b5c4a]">Manage the compliance documents used across your bid submissions.</p>

      <div className="mt-8">
        <DocumentCompleteness
          checklist={checklist}
          mode="bidder"
          onUpload={() => setUploadedMissing(true)}
          title="Document Completeness — Supply of Medical Equipment"
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold">Uploaded Documents</h2>

      <div className="mt-8 flex flex-col gap-3">
        {docs.map((doc) => (
          <SectionCard key={doc.id} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-[#f1ece2] text-[#3d2b1f]">
                <FileText size={16} />
              </span>
              <div>
                <p className="font-medium text-[#3d2b1f]">{doc.name}</p>
                <p className="text-xs text-[#8a7c68]">{doc.type} · Uploaded {doc.uploadDate}</p>
                {doc.aiNote && <p className="mt-1 max-w-md text-xs text-[#9c6b1a]">{doc.aiNote}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={doc.status} />
              <Button variant="ghost" size="sm" onClick={() => simulateUpload(doc.id)}>
                <UploadCloud size={14} /> Re-upload
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </PageContainer>
  );
}

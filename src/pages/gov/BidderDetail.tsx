import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Flag, Zap, FileBarChart2 } from "lucide-react";
import { PageContainer, SectionCard, StatusBadge, ComplianceScore, Button, Notice } from "../../components/ui";
import { AIAnalysisModal } from "../../components/ai/AIAnalysisModal";
import { ComplianceOverview, RequirementResultList } from "../../components/intel/ComplianceOverview";
import { RequirementDrawer } from "../../components/intel/RequirementDrawer";
import { DocumentCompleteness } from "../../components/intel/DocumentCompleteness";
import { ConsistencyCheck } from "../../components/intel/ConsistencyCheck";
import { RiskOverviewPanel } from "../../components/intel/RiskOverviewPanel";
import { AuditTrail } from "../../components/intel/AuditTrail";
import { AIPipelineStrip } from "../../components/intel/AIPipelineStrip";
import { ProcessingSequence, useProcessingRun } from "../../components/intel/ProcessingSequence";
import { bidEvaluationSteps, countResults, getIntelligence, getRequirements } from "../../data/intelligenceData";
import { tenders, companies, formatINR } from "../../data/mockData";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const sections = [
  "Company Information",
  "Requirements",
  "Evidence & Documents",
  "Consistency",
  "Technical Proposal",
  "Quotation",
  "Risk & Audit",
  "AI Assessment",
] as const;

export default function GovBidderDetail() {
  const { id, bidderId } = useParams();
  const { bidsState } = useApp();
  const tender = tenders.find((t) => t.id === decodeURIComponent(id ?? ""));
  const company = companies.find((c) => c.id === bidderId);
  const bid = bidsState.find((b) => b.tenderId === tender?.id && b.bidderId === bidderId);
  const [active, setActive] = useState<(typeof sections)[number]>("Company Information");
  const [docStates, setDocStates] = useState<Record<string, "verified" | "warning" | "pending" | "failed">>({});
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [openRequirementId, setOpenRequirementId] = useState<string | null>(null);

  const requirements = getRequirements(tender?.id);
  const intel = getIntelligence(tender?.id, bidderId);
  const counts = intel ? countResults(intel.results, requirements) : null;
  const evaluationRun = useProcessingRun(bidEvaluationSteps.length, 520, "done");

  if (!tender || !company || !bid) {
    return (
      <PageContainer>
        <p>Bidder record not found.</p>
      </PageContainer>
    );
  }

  const markDoc = (id: string, status: "verified" | "warning") => {
    setDocStates((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <PageContainer>
      <Link to={`/gov/tenders/${encodeURIComponent(tender.id)}`} className="text-sm font-medium text-[#3d2b1f] underline">
        ← Back to {tender.title}
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{company.name}</h1>

      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e5ded1] bg-[#e5ded1] sm:grid-cols-5">
        {(counts
          ? [
              ["Requirements Evaluated", String(counts.total), "text-[#3d2b1f]"],
              ["Compliant", String(counts.compliant), "text-[#2f6b3a]"],
              ["Needs Review", String(counts.needsReview), "text-[#9c6b1a]"],
              ["Critical Failures", String(counts.criticalFailures), counts.criticalFailures ? "text-[#9c3131]" : "text-[#3d2b1f]"],
              ["Quotation", formatINR(bid.quotation.finalAmount), "text-[#3d2b1f]"],
            ]
          : [
              ["Compliance", `${bid.compliance}%`, "text-[#3d2b1f]"],
              ["Documents", bid.documentsComplete, "text-[#3d2b1f]"],
              ["Warnings", String(bid.warnings.length), "text-[#3d2b1f]"],
              ["Quotation", formatINR(bid.quotation.finalAmount), "text-[#3d2b1f]"],
              ["Status", bid.status, "text-[#3d2b1f]"],
            ]
        ).map(([label, value, tone]) => (
          <div key={label} className="bg-white p-5">
            <p className={cn("text-2xl font-semibold", tone)}>{value}</p>
            <p className="mt-1 text-sm text-[#6b5c4a]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[#e5ded1]">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={cn(
              "shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active === s ? "border-[#3d2b1f] text-[#3d2b1f]" : "border-transparent text-[#8a7c68] hover:text-[#3d2b1f]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Company Information" && (
          <SectionCard>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Legal Name", company.legalName],
                ["CIN", company.cin],
                ["PAN", company.pan],
                ["GSTIN", company.gstin],
                ["Udyam", company.udyam],
                ["Business Type", company.businessType],
                ["Address", `${company.address}, ${company.district}, ${company.state}`],
                ["Contact Person", company.contactPerson],
                ["Email", company.email],
                ["Phone", company.phone],
                ["Established", company.yearEstablished],
                ["Category", company.category],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">{label}</dt>
                  <dd className="mt-1 text-sm text-[#3d2b1f]">{value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        )}

        {active === "Requirements" && (
          <div className="space-y-6">
            {intel && requirements.length > 0 ? (
              <>
                <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-[#3d2b1f]">Bidder Evaluation</h2>
                      <p className="mt-1 max-w-2xl text-sm text-[#6b5c4a]">
                        Values were extracted from the submitted documents, compared against the tender's structured
                        rules and linked back to their source pages. Last run: {intel.analysedAt}.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={evaluationRun.start}
                      disabled={evaluationRun.state === "running"}
                      className="shrink-0"
                    >
                      <Zap size={16} />
                      {evaluationRun.state === "running" ? "Evaluating…" : "Re-run Evaluation"}
                    </Button>
                  </div>
                  {evaluationRun.state === "running" && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                      <ProcessingSequence
                        steps={bidEvaluationSteps}
                        currentStep={evaluationRun.currentStep}
                        state={evaluationRun.state}
                        title="Evaluating bid"
                      />
                    </motion.div>
                  )}
                </div>

                <ComplianceOverview
                  requirements={requirements}
                  results={intel.results}
                  score={intel.overallScore}
                  onOpenRequirement={setOpenRequirementId}
                />

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#3d2b1f]">Requirement Results</h3>
                  <RequirementResultList
                    requirements={requirements}
                    results={intel.results}
                    onOpenRequirement={setOpenRequirementId}
                  />
                </div>
              </>
            ) : null}

          <SectionCard>
            <h3 className="text-lg font-semibold">Eligibility Summary</h3>
            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
              <ComplianceScore value={bid.compliance} size="lg" />
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                {bid.complianceItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-3 py-2.5">
                    <span className="text-sm font-medium text-[#3d2b1f]">{item.label}</span>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
            {bid.warnings.length > 0 && (
              <div className="mt-5 space-y-2">
                {bid.warnings.map((w) => (
                  <div key={w.title} className="flex items-start gap-2 rounded-md border border-[#f0dcb2] bg-[#fbf1e0] p-3 text-sm">
                    <Flag size={14} className="mt-0.5 text-[#9c6b1a]" />
                    <div><span className="font-medium text-[#7a5510]">{w.title}: </span><span className="text-[#7a5510]">{w.detail}</span></div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
          </div>
        )}

        {active === "Evidence & Documents" && (
          <div className="space-y-6">
            {intel && (
              <DocumentCompleteness checklist={intel.documents} mode="gov" />
            )}
            <div className="space-y-4">
            {company.documents.map((doc) => {
              const status = docStates[doc.id] ?? doc.status;
              return (
                <SectionCard key={doc.id}>
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-[#f1ece2] text-[#3d2b1f]"><FileText size={16} /></span>
                      <div>
                        <p className="font-medium text-[#3d2b1f]">{doc.type}</p>
                        <p className="text-xs text-[#8a7c68]">Submitted: {doc.name}</p>
                        {doc.confidence !== undefined && <p className="mt-1 text-xs text-[#8a7c68]">AI Confidence: {doc.confidence}%</p>}
                        {doc.aiNote && <p className="mt-2 max-w-md text-sm text-[#6b5c4a]"><span className="font-medium text-[#3d2b1f]">AI Assessment: </span>{doc.aiNote}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={status} />
                      <Button size="sm" variant="secondary" onClick={() => markDoc(doc.id, "verified")}>Mark Verified</Button>
                      <Button size="sm" variant="ghost" onClick={() => markDoc(doc.id, "warning")}>Flag for Review</Button>
                    </div>
                  </div>
                </SectionCard>
              );
            })}
            </div>
          </div>
        )}

        {active === "Consistency" && intel && (
          <div className="space-y-5">
            <AIPipelineStrip highlight="evidence" />
            <ConsistencyCheck fields={intel.consistency} findings={intel.findings} />
          </div>
        )}

        {active === "Risk & Audit" && intel && (
          <div className="space-y-6">
            <RiskOverviewPanel
              risk={intel.risk}
              title="Procurement Risk Overview"
              scopeLabel={`${intel.bidderName} · ${tender.title}`}
            />
            <AuditTrail entries={intel.audit} />
            <SectionCard className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold">Compliance Report</h3>
                <p className="mt-1 text-sm text-[#6b5c4a]">
                  Produce the auditable evaluation trail for this bidder: rule applied, bidder value, result, evidence
                  page and review decision.
                </p>
              </div>
              <Link
                to={`/gov/reports/${encodeURIComponent(tender.id)}?bidder=${intel.bidderId}`}
                className="shrink-0"
              >
                <Button>
                  <FileBarChart2 size={16} /> Generate Compliance Report
                </Button>
              </Link>
            </SectionCard>
          </div>
        )}

        {active === "Technical Proposal" && (
          <SectionCard>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Product</dt><dd className="mt-1 text-sm">{bid.productDetails.product}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Manufacturer</dt><dd className="mt-1 text-sm">{bid.productDetails.manufacturer}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Available Quantity</dt><dd className="mt-1 text-sm">{bid.productDetails.availableQuantity} units</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Delivery Capacity</dt><dd className="mt-1 text-sm">{bid.productDetails.deliveryCapacity}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Warranty</dt><dd className="mt-1 text-sm">{bid.productDetails.warranty}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Technical Specifications</dt><dd className="mt-1 text-sm">{bid.productDetails.technicalSpecs}</dd></div>
            </dl>
          </SectionCard>
        )}

        {active === "Quotation" && (
          <SectionCard>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Quantity</dt><dd className="mt-1 text-sm">{bid.quotation.quantity.toLocaleString("en-IN")}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Unit Price</dt><dd className="mt-1 text-sm">₹{bid.quotation.unitPrice.toLocaleString("en-IN")}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Taxes + Delivery</dt><dd className="mt-1 text-sm">{formatINR(bid.quotation.taxes + bid.quotation.delivery)}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Final Quotation</dt><dd className="mt-1 text-base font-semibold">{formatINR(bid.quotation.finalAmount)}</dd></div>
            </dl>
          </SectionCard>
        )}

        {active === "AI Assessment" && (
          <div className="space-y-5">
            <AIPipelineStrip />
            <SectionCard>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldCheck size={18} /> AI Compliance Assessment</h2>
                <Button size="sm" onClick={() => setAiModalOpen(true)} className="flex items-center gap-2">
                  <Zap size={16} />
                  Run AI Analysis
                </Button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Overall Compliance", bid.aiAssessment.overall],
                  ["Document Match", bid.aiAssessment.documentMatch],
                  ["Eligibility", bid.aiAssessment.eligibility],
                  ["Technical Compliance", bid.aiAssessment.technicalCompliance],
                ].map(([label, value]) => (
                  <div key={label as string} className="text-center">
                    <ComplianceScore value={value as number} size="sm" />
                    <p className="mt-2 text-xs text-[#6b5c4a]">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#5b4a3a]">{bid.aiAssessment.summary}</p>
              <div className="mt-5">
                <Notice>AI-assisted assessment. Final procurement decisions remain with the authorized procurement officer.</Notice>
              </div>
            </SectionCard>

            {company && tender && (
              <AIAnalysisModal
                open={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
                company={company}
                tender={tender}
              />
            )}
          </div>
        )}
      </div>

      <RequirementDrawer
        open={openRequirementId !== null}
        onClose={() => setOpenRequirementId(null)}
        requirement={requirements.find((r) => r.id === openRequirementId) ?? null}
        result={intel?.results.find((r) => r.requirementId === openRequirementId) ?? null}
        bidderName={company.name}
        reviewLink={`/gov/tenders/${encodeURIComponent(tender.id)}`}
      />
    </PageContainer>
  );
}

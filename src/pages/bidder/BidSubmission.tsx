import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button, PageContainer, SectionCard, StatusBadge, ComplianceScore, ConfirmationModal, Timeline } from "../../components/ui";
import { BidReadinessPanel } from "../../components/intel/BidReadinessPanel";
import { ConsistencyCheck } from "../../components/intel/ConsistencyCheck";
import { bidReadiness } from "../../data/intelligenceData";
import { tenders, formatINR, type Bid } from "../../data/mockData";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const steps = ["Company Information", "Product & Supply", "Quotation", "AI Bid Readiness", "Review & Submit"];

export default function BidSubmission() {
  const { id } = useParams();
  const { currentCompany, addBid } = useApp();
  const tender = tenders.find((t) => t.id === decodeURIComponent(id ?? ""));

  const [step, setStep] = useState(0);
  const [manufacturer, setManufacturer] = useState(currentCompany?.name ?? "");
  const [availableQty, setAvailableQty] = useState(650);
  const [deliveryCapacity, setDeliveryCapacity] = useState(tender?.deliveryPeriod ?? "90 days");
  const [warranty, setWarranty] = useState("3 years");
  const [techSpecs, setTechSpecs] = useState(
    "15-inch multi-parameter display, SpO2/ECG/NIBP/Temp sensors, WiFi + Bluetooth connectivity, central nursing station compatibility, CE and ISO 13485 certified."
  );
  const [unitPrice, setUnitPrice] = useState(85000);
  const [taxes, setTaxes] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [readinessState, setReadinessState] = useState({ scanned: false, readiness: bidReadiness.readiness, criticalIssues: 1 });
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState<Bid | null>(null);

  const quantity = tender?.requiredQuantity ?? 0;
  const total = unitPrice * quantity;
  const finalAmount = total + taxes + delivery;

  const allIssuesResolved = readinessState.readiness >= 95;

  const complianceItems = useMemo(() => {
    const base: { label: string; status: "verified" | "warning" }[] = [
      { label: "GST Registration", status: "verified" },
      { label: "PAN", status: "verified" },
      { label: "Income Tax", status: "verified" },
      { label: "Udyam / MSME", status: "verified" },
      { label: "EPFO", status: allIssuesResolved ? "verified" : "warning" },
      { label: "ESIC", status: "verified" },
    ];
    return base;
  }, [allIssuesResolved]);

  const complianceScore = allIssuesResolved ? 96 : 91;

  if (!tender) {
    return (
      <PageContainer>
        <p>Tender not found.</p>
      </PageContainer>
    );
  }

  const confirmSubmit = () => {
    const submissionId = `BID-2026-${Math.floor(80000 + Math.random() * 9000)}`;
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      submissionId,
      tenderId: tender.id,
      bidderId: currentCompany?.id ?? "apex-medical",
      bidderName: currentCompany?.name ?? "Bidder",
      submittedDate: "27 August 2026",
      status: "Under Government Review",
      compliance: complianceScore,
      documentsComplete: allIssuesResolved ? "9/9" : "8/9",
      quotation: { quantity, unitPrice, total, taxes, delivery, finalAmount },
      productDetails: {
        product: tender.product,
        manufacturer,
        availableQuantity: availableQty,
        deliveryCapacity,
        warranty,
        technicalSpecs: techSpecs,
      },
      complianceItems: complianceItems.map((c) => ({ label: c.label, status: c.status })),
      warnings: allIssuesResolved
        ? []
        : [{ title: "OEM Authorization", detail: "Mandatory OEM authorization letter was not uploaded before submission.", severity: "issue" }],
      aiAssessment: {
        overall: complianceScore,
        documentMatch: 96,
        eligibility: 94,
        technicalCompliance: 93,
        summary: "The bidder satisfies the majority of mandatory eligibility requirements. Technical specifications appear consistent with the tender requirements.",
      },
    };
    addBid(newBid);
    setShowConfirm(false);
    setSubmitted(newBid);
  };

  if (submitted) {
    return (
      <PageContainer className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[#e5ded1] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf3ea]">
            <CheckCircle2 size={28} className="text-[#2f6b3a]" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Bid Submitted Successfully</h1>
          <div className="mt-4 grid grid-cols-2 gap-4 text-left text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Tender</p>
              <p className="mt-1 font-mono">{tender.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Submission ID</p>
              <p className="mt-1 font-mono">{submitted.submissionId}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Submitted</p>
              <p className="mt-1">{submitted.submittedDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Current Status</p>
              <p className="mt-1 font-medium text-[#3a5a9c]">Under Government Review</p>
            </div>
          </div>
        </motion.div>

        <SectionCard className="mt-6">
          <h2 className="text-lg font-semibold">Submission Timeline</h2>
          <div className="mt-4">
            <Timeline
              steps={[
                { label: "Bid Submitted", state: "done" },
                { label: "Initial Compliance Check", state: "done" },
                { label: "Government Evaluation", state: "current" },
                { label: "Final Decision", state: "upcoming" },
              ]}
            />
          </div>
        </SectionCard>

        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/bidder/bids/${submitted.id}`}><Button>Track Bid Status <ArrowRight size={16} /></Button></Link>
          <Link to="/bidder"><Button variant="secondary">Back to Portal</Button></Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-4xl">
      <h1 className="text-3xl font-semibold tracking-tight">Submit Your Bid</h1>
      <SectionCard className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{tender.title}</p>
            <p className="text-sm text-[#6b5c4a]">{tender.ministry}</p>
          </div>
          <p className="font-mono text-xs text-[#8a7c68]">{tender.id}</p>
        </div>
      </SectionCard>

      {/* Stepper */}
      <div className="mt-8 flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center min-w-[90px]">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold shrink-0",
                  i < step ? "border-[#2f6b3a] bg-[#2f6b3a] text-white" : i === step ? "border-[#8a5a35] text-[#8a5a35] bg-[#f7f0e6]" : "border-[#dcd3c4] text-[#b3a892]"
                )}
              >
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </span>
              <span className={cn("hidden text-center text-[11px] font-medium sm:block", i <= step ? "text-[#3d2b1f]" : "text-[#b3a892]")}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("mx-2 h-px flex-1", i < step ? "bg-[#2f6b3a]" : "bg-[#e2d9c9]")} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }} className="mt-6 rounded-lg border border-[#e5ded1] bg-white p-6">
          {step === 0 && currentCompany && (
            <div>
              <h2 className="text-lg font-semibold">Company Information</h2>
              <p className="mt-1 text-sm text-[#6b5c4a]">Automatically populated from your verified company profile.</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Company Name", currentCompany.name],
                  ["GSTIN", currentCompany.gstin],
                  ["PAN", currentCompany.pan],
                  ["Udyam Registration", currentCompany.udyam],
                  ["Contact Person", currentCompany.contactPerson],
                  ["Email", currentCompany.email],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">{label}</dt>
                    <dd className="mt-1 text-sm text-[#3d2b1f]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold">Product / Supply Details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ReadField label="Product" value={tender.product} />
                <TextField label="Manufacturer" value={manufacturer} onChange={setManufacturer} />
                <NumField label="Available Quantity" value={availableQty} onChange={setAvailableQty} />
                <ReadField label="Required Quantity" value={`${tender.requiredQuantity.toLocaleString("en-IN")} units`} />
                <TextField label="Delivery Capacity" value={deliveryCapacity} onChange={setDeliveryCapacity} />
                <TextField label="Warranty" value={warranty} onChange={setWarranty} />
              </div>
              <div className="mt-5">
                <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Technical Specifications</label>
                <textarea
                  value={techSpecs}
                  onChange={(e) => setTechSpecs(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] p-3 text-sm outline-none focus:border-[#8a5a35]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold">Bidder Quotation</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ReadField label="Quantity" value={`${quantity.toLocaleString("en-IN")}`} />
                <NumField label="Unit Price (₹)" value={unitPrice} onChange={setUnitPrice} />
                <NumField label="Taxes (₹)" value={taxes} onChange={setTaxes} />
                <NumField label="Delivery Charges (₹)" value={delivery} onChange={setDelivery} />
              </div>
              <div className="mt-6 rounded-md border border-[#e5ded1] bg-[#faf8f4] p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b5c4a]">Base Total ({quantity} × ₹{unitPrice.toLocaleString("en-IN")})</span>
                  <span className="font-medium">{formatINR(total)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[#6b5c4a]">Taxes + Delivery</span>
                  <span className="font-medium">{formatINR(taxes + delivery)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#e5ded1] pt-3 text-base font-semibold">
                  <span>Final Quotation</span>
                  <span>{formatINR(finalAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold">AI Bid Readiness Check</h2>
              <p className="mt-1 text-sm text-[#6b5c4a]">
                Before submitting, NirnayAI checks your documents and proposal against the tender's structured
                requirements so you can fix avoidable problems.
              </p>

              <div className="mt-5">
                <BidReadinessPanel data={bidReadiness} onReadinessChange={setReadinessState} />
              </div>

              {readinessState.scanned && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-[#3d2b1f]">Eligibility Snapshot</h3>
                    <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
                      <ComplianceScore value={complianceScore} size="lg" />
                      <div className="grid flex-1 gap-2 sm:grid-cols-2">
                        {complianceItems.map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-3 py-2">
                            <span className="text-xs font-medium text-[#3d2b1f]">{item.label}</span>
                            <StatusBadge status={item.status} />
                          </div>
                        ))}
                        <div className="flex items-center justify-between rounded-md border border-[#e5ded1] px-3 py-2">
                          <span className="text-xs font-medium text-[#3d2b1f]">Make in India</span>
                          <StatusBadge status="verified" label="Eligible" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <ConsistencyCheck
                    fields={bidReadiness.consistency}
                    findings={bidReadiness.findings}
                    title="AI Consistency Check"
                    description="Your own documents are compared against each other so mismatches are corrected before an officer sees them."
                  />
                </motion.div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold">Review Your Bid</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Company</dt><dd className="mt-1 text-sm">{currentCompany?.name}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Tender</dt><dd className="mt-1 text-sm">{tender.title}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Quantity</dt><dd className="mt-1 text-sm">{quantity.toLocaleString("en-IN")}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Quotation</dt><dd className="mt-1 text-sm">{formatINR(finalAmount)}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Documents</dt><dd className="mt-1 text-sm">{readinessState.readiness >= 95 ? "9/9" : "8/9"} uploaded</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Compliance</dt><dd className="mt-1 text-sm">{complianceScore}%</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Open Issues</dt><dd className="mt-1 text-sm">{readinessState.readiness >= 95 ? 0 : readinessState.criticalIssues + 1}</dd></div>
                <div><dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Bid Readiness</dt><dd className="mt-1 text-sm">{readinessState.readiness}%</dd></div>
              </dl>
              <Button className="mt-6" onClick={() => setShowConfirm(true)}>Submit Bid</Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
        {step < steps.length - 1 && (
          <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === 3 && !readinessState.scanned}>
            Continue
          </Button>
        )}
      </div>

      <ConfirmationModal
        open={showConfirm}
        title="Submit Bid?"
        description="Once submitted, the bid will be sent to the procurement authority for evaluation."
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmSubmit}
        confirmLabel="Confirm Submission"
      />
    </PageContainer>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <div className="rounded-md border border-[#e5ded1] bg-[#f6f1e8] py-2.5 px-3 text-sm text-[#5b4a3a]">{value}</div>
    </div>
  );
}
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
    </div>
  );
}
function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
    </div>
  );
}

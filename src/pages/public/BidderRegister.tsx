import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2, UploadCloud, FileCheck2, ArrowRight } from "lucide-react";
import { Button, PageContainer, Notice, StatusBadge } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const steps = ["Company Details", "Company Verification", "Documents", "Account"];

const requiredDocs = [
  "GST Certificate",
  "PAN",
  "Udyam Certificate",
  "Income Tax Documents",
  "EPFO Certificate",
  "ESIC Certificate",
  "Company Registration Certificate",
  "Other Supporting Documents",
];

export default function BidderRegister() {
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [verifyState, setVerifyState] = useState<"idle" | "loading" | "done">("idle");
  const [verifyWarning, setVerifyWarning] = useState(false);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();
  const { loginAsBidder } = useApp();

  const runVerification = () => {
    setVerifyState("loading");
    setTimeout(() => {
      setVerifyState("done");
      setVerifyWarning(companyName.toLowerCase().includes("nova"));
    }, 1800);
  };

  const toggleUpload = (doc: string) => {
    setUploaded((prev) => ({ ...prev, [doc]: true }));
  };

  const uploadedCount = Object.values(uploaded).filter(Boolean).length;

  const workflow = [
    { title: "1. Create your company profile", text: "Enter your legal details, business category and contact information for verification." },
    { title: "2. Verify your organization", text: "The platform checks GST, PAN, Udyam and registration data to spot gaps before you bid." },
    { title: "3. Upload required documents", text: "Add the compliance documents required for eligibility and tender participation." },
    { title: "4. Browse available tenders", text: "Once registered, you can view open and active opportunities in the bidder dashboard." },
    { title: "5. Review tender requirements", text: "Check scope, technical specifications, quantity, delivery timelines and documentation needs." },
    { title: "6. Submit your bid", text: "Upload your quotation, product details and supporting evidence, then submit with confidence." },
  ];

  const finish = () => {
    setComplete(true);
    window.setTimeout(() => {
      loginAsBidder("apex-medical");
      navigate("/bidder");
    }, 1200);
  };

  if (complete) {
    return (
      <PageContainer className="max-w-lg">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[#e5ded1] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf3ea]">
            <CheckCircle2 size={28} className="text-[#2f6b3a]" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Registration Complete</h1>
          <p className="mt-3 text-sm text-[#6b5c4a]">
            Your organization profile has been created. You can now browse open tenders and submit bids from your
            bidder portal.
          </p>
          <Button className="mt-6" onClick={() => navigate("/bidder")}>
            Go to Bidder Portal <ArrowRight size={16} />
          </Button>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Register as a Bidder</h1>
      <p className="mt-2 text-[#6b5c4a]">Create your organization profile to participate in government procurement opportunities.</p>

      {/* Stepper */}
      <div className="mt-8 flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                  i < step ? "border-[#2f6b3a] bg-[#2f6b3a] text-white" : i === step ? "border-[#8a5a35] text-[#8a5a35] bg-[#f7f0e6]" : "border-[#dcd3c4] text-[#b3a892]"
                )}
              >
                {i < step ? <CheckCircle2 size={16} /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className={cn("hidden text-xs font-medium sm:block", i <= step ? "text-[#3d2b1f]" : "text-[#b3a892]")}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("mx-2 h-px flex-1", i < step ? "bg-[#2f6b3a]" : "bg-[#e2d9c9]")} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 rounded-lg border border-[#e5ded1] bg-white p-6"
        >
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold">Company Details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Company Name" placeholder="e.g. Apex Medical Systems Pvt. Ltd." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                <Field label="Legal Business Name" placeholder="Legal registered name" />
                <Field label="CIN / Registration Number" placeholder="e.g. U33110DL2011PTC212345" />
                <Field label="PAN" placeholder="e.g. AAFCA1234B" />
                <Field label="GSTIN" placeholder="e.g. 07AAFCA1234B1Z5" />
                <Field label="Udyam Registration Number" placeholder="e.g. UDYAM-DL-03-0012345" />
                <SelectField label="Business Type" options={["Private Limited Company", "LLP", "Partnership", "Proprietorship", "Public Limited"]} />
                <Field label="Registered Address" placeholder="Street, area" />
                <SelectField label="State" options={["Delhi", "Maharashtra", "Karnataka", "Gujarat", "Tamil Nadu"]} />
                <Field label="District" placeholder="e.g. South East Delhi" />
                <Field label="Contact Person" placeholder="Full name" />
                <Field label="Official Email" type="email" placeholder="you@company.com" />
                <Field label="Phone" type="tel" placeholder="+91" />
                <Field label="Website" placeholder="www.company.com" />
                <Field label="Year Established" placeholder="e.g. 2011" />
                <SelectField label="Primary Business Category" options={["Medical Equipment", "IT Infrastructure", "Renewable Energy", "Furniture", "Construction"]} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold">Verify Your Organization</h2>
              <p className="mt-2 text-sm text-[#6b5c4a]">
                <strong>AI-assisted document cross-check.</strong> The platform compares submitted company information
                and documents against authorized government records and available official verification sources.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(["GST Registration", "PAN", "Udyam / MSME", "Company Registration"] as const).map((label) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-4 py-3">
                    <span className="text-sm font-medium text-[#3d2b1f]">{label}</span>
                    <StatusBadge
                      status={
                        verifyState === "done"
                          ? verifyWarning && (label === "PAN" || label === "Company Registration")
                            ? "warning"
                            : "verified"
                          : "pending"
                      }
                    />
                  </div>
                ))}
              </div>

              {verifyState === "idle" && (
                <Button className="mt-6" onClick={runVerification}>
                  Run Verification
                </Button>
              )}

              {verifyState === "loading" && (
                <div className="mt-6 flex items-center gap-3 rounded-md border border-[#e5ded1] bg-[#faf8f4] px-4 py-4 text-sm text-[#6b5c4a]">
                  <Loader2 size={18} className="animate-spin text-[#8a5a35]" />
                  Cross-checking submitted information against verification sources...
                </div>
              )}

              {verifyState === "done" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-2">
                  {!verifyWarning ? (
                    <>
                      <CheckLine text="GST details matched" />
                      <CheckLine text="PAN details matched" />
                      <CheckLine text="Udyam registration matched" />
                      <CheckLine text="Company information matched" />
                      <div className="mt-4 rounded-md border border-[#c9e2cb] bg-[#eaf3ea] px-4 py-3">
                        <p className="font-semibold text-[#2f6b3a]">Organization Verified</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckLine text="GST details matched" />
                      <WarnLine text="PAN name partially matches registered legal name" />
                      <CheckLine text="Udyam registration matched" />
                      <WarnLine text="Company registration record requires manual confirmation" />
                      <div className="mt-4 flex items-start gap-2 rounded-md border border-[#f0dcb2] bg-[#fbf1e0] px-4 py-3">
                        <AlertTriangle size={16} className="mt-0.5 text-[#9c6b1a]" />
                        <p className="font-semibold text-[#9c6b1a]">Organization Verified with Warnings — manual review recommended</p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold">Organization Documents</h2>
              <p className="mt-2 text-sm text-[#6b5c4a]">Upload the documents required for tender eligibility. ({uploadedCount}/{requiredDocs.length} uploaded)</p>
              <div className="mt-5 space-y-3">
                {requiredDocs.map((doc) => (
                  <div key={doc} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-4 py-3">
                    <div className="flex items-center gap-3">
                      {uploaded[doc] ? <FileCheck2 size={18} className="text-[#2f6b3a]" /> : <UploadCloud size={18} className="text-[#a4977f]" />}
                      <div>
                        <p className="text-sm font-medium text-[#3d2b1f]">{doc}</p>
                        {uploaded[doc] && <p className="text-xs text-[#8a7c68]">{doc.replace(/\s+/g, "_")}.pdf uploaded</p>}
                      </div>
                    </div>
                    {uploaded[doc] ? (
                      <StatusBadge status="verified" label="Uploaded" />
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => toggleUpload(doc)}>
                        Upload
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold">Create Account</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Login Email" type="email" placeholder="you@company.com" defaultValue={companyName ? `contact@${companyName.split(" ")[0].toLowerCase()}.com` : ""} />
                <Field label="Phone Number" type="tel" placeholder="+91" />
                <Field label="Create Password" type="password" placeholder="••••••••" />
                <Field label="Confirm Password" type="password" placeholder="••••••••" />
              </div>
              <div className="mt-5">
                <Notice>By registering, you confirm the accuracy of the information and documents submitted for verification.</Notice>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={step === 1 && verifyState !== "done"}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={finish}>Complete Registration</Button>
        )}
      </div>

      <div className="mt-10 w-full max-w-[1400px] rounded-lg border border-[#e5ded1] bg-white p-5 shadow-[0_10px_24px_rgba(90,74,54,0.04)]">
        <h2 className="text-lg font-semibold text-[#3d2b1f]">What to expect after you register</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {workflow.map((step) => (
            <div key={step.title} className="rounded-md border border-[#efe7dc] bg-[#faf8f4] p-3">
              <p className="text-sm font-semibold text-[#3d2b1f]">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-[#6b5c4a]">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-[#e5ded1] bg-[#f8f4ee] p-4">
          <h3 className="text-lg font-semibold text-[#3d2b1f]">Need help?</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#5b4a3a]">
            <li>• Review the compliance documents required before submission.</li>
            <li>• Use the bidder dashboard to compare tenders and requirements.</li>
            <li>• Check the help center for guidance on registration and bidding steps.</li>
          </ul>
          <Link to="/help" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f] underline underline-offset-2">
            Open Help Center <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-[#8a7c68]">
        Already registered? <Link to="/login/bidder" className="font-medium text-[#3d2b1f] underline">Bidder Login</Link>
      </p>
    </PageContainer>
  );
}

function CheckLine({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-[#2f6b3a]">
      <CheckCircle2 size={15} /> {text}
    </p>
  );
}
function WarnLine({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-[#9c6b1a]">
      <AlertTriangle size={15} /> {text}
    </p>
  );
}

function Field({ label, className, ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <input {...props} className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <select className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

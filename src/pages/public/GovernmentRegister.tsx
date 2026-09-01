import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button, PageContainer, Notice } from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function GovernmentRegister() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { loginAsGovernment } = useApp();

  const workflow = [
    { title: "1. Create your officer profile", text: "Add your official identity, department, ministry and contact information for verification." },
    { title: "2. Review tender publishing workflow", text: "Set up the tender lifecycle, required documents and eligibility criteria for each procurement item." },
    { title: "3. Publish and monitor tenders", text: "Launch tenders and track them from publication through evaluation and final decision-making." },
    { title: "4. Review bidder submissions", text: "Check bidder eligibility, required documents and quote quality before comparison." },
    { title: "5. Compare compliance signals", text: "Use the dashboard to review technical compliance, document completeness and recommendation insights." },
    { title: "6. Approve the final outcome", text: "Make the final decision with traceable evidence and clear bidder communication." },
  ];

  if (submitted) {
    return (
      <PageContainer className="max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-[#e5ded1] bg-white p-8 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf3ea]">
            <CheckCircle2 size={28} className="text-[#2f6b3a]" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Registration Submitted</h1>
          <p className="mt-3 text-sm text-[#6b5c4a]">
            Your government officer account request has been recorded. Government accounts require authorization
            before access is granted. You will be notified once your account is verified by the platform
            administrator.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate("/login/government")}>Continue to Login</Button>
            <Link to="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Government Officer Registration</h1>
      <p className="mt-2 text-[#6b5c4a]">Register as an authorized government procurement official.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          window.setTimeout(() => {
            loginAsGovernment();
            navigate("/gov");
          }, 1200);
        }}
        className="mt-8 space-y-5 rounded-lg border border-[#e5ded1] bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" placeholder="e.g. Anjali Sharma" required />
          <Field label="Official Email" type="email" placeholder="name@gov.in" required />
          <Field label="Employee / Officer ID" placeholder="e.g. DGHS-2291" required />
          <Field label="Department" placeholder="e.g. Directorate General of Health Services" required />
          <Field label="Ministry / Organization" placeholder="e.g. Ministry of Health & Family Welfare" required />
          <Field label="Designation" placeholder="e.g. Deputy Procurement Officer" required />
          <Field label="Official Phone Number" type="tel" placeholder="+91" required />
          <Field label="Office Location" placeholder="e.g. New Delhi" required />
          <Field label="Create Password" type="password" placeholder="••••••••" required />
          <Field label="Confirm Password" type="password" placeholder="••••••••" required />
        </div>

        <Notice tone="warning">
          <span className="flex items-center gap-1.5"><ShieldAlert size={14} /> Government accounts require authorization before access is granted.</span>
        </Notice>

        <Button type="submit" className="w-full">Register</Button>
      </form>
      <div className="mt-10 w-full max-w-[1400px] rounded-lg border border-[#e5ded1] bg-white p-5 shadow-[0_10px_24px_rgba(90,74,54,0.04)]">
        <h2 className="text-lg font-semibold text-[#3d2b1f]">What the workflow looks like</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {workflow.map((step) => (
            <div key={step.title} className="rounded-md border border-[#efe7dc] bg-[#faf8f4] p-3">
              <p className="text-sm font-semibold text-[#3d2b1f]">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-[#6b5c4a]">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-[#e5ded1] bg-[#f8f4ee] p-4">
          <h3 className="text-lg font-semibold text-[#3d2b1f]">Support and guidance</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#5b4a3a]">
            <li>• Learn how tender publishing and evaluation work in the workflow.</li>
            <li>• Review how compliance signals are surfaced for each bidder.</li>
            <li>• Use the help center to understand role-based actions and next steps.</li>
          </ul>
          <Link to="/help" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f] underline underline-offset-2">
            Open Help Center <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-[#8a7c68]">
        Already registered? <Link to="/login/government" className="font-medium text-[#3d2b1f] underline">Government Login</Link>
      </p>
    </PageContainer>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]"
      />
    </div>
  );
}



import { Link } from "react-router-dom";
import { FileSearch, Building2, ScanSearch, Gavel, ArrowRight, ShieldCheck, Mail, Phone, HelpCircle } from "lucide-react";
import { PageContainer, Button, SectionCard } from "../../components/ui";

export function HowItWorks() {
  const flow = [
    { icon: <FileSearch size={20} />, title: "1. Government publishes requirements", desc: "A procurement officer publishes a tender with eligibility criteria, required documents, quantities and specifications." },
    { icon: <Building2 size={20} />, title: "2. Bidder registers", desc: "A company registers its organization profile and submits company details for the platform." },
    { icon: <ShieldCheck size={20} />, title: "3. Bidder verifies company", desc: "GST, PAN, Udyam and company registration are cross-checked in a simulated AI-assisted verification step." },
    { icon: <FileSearch size={20} />, title: "4. Bidder submits documents & quotation", desc: "The bidder uploads compliance documents, product/supply details and a formal quotation." },
    { icon: <ScanSearch size={20} />, title: "5. AI-assisted compliance checking", desc: "The platform runs a pre-check to flag missing information, mismatches or documents needing review." },
    { icon: <Gavel size={20} />, title: "6. Government reviews & compares bids", desc: "Officers compare compliance, documents, technical proposals and quotations across bidders." },
    { icon: <ShieldCheck size={20} />, title: "7. Government approves or rejects", desc: "The officer selects a bidder and approves or rejects the tender submission." },
    { icon: <Building2 size={20} />, title: "8. Bidder sees results & issues", desc: "Bidders see the final decision along with specific compliance findings, without exposing competitor data." },
  ];
  return (
    <PageContainer>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">How Nirnay AI Works</h1>
        <p className="mt-3 text-[#6b5c4a]">
          A continuous compliance workflow connecting government procurement officers with registered bidders.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {flow.map((step) => (
          <SectionCard key={step.title}>
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f1ece2] text-[#3d2b1f]">{step.icon}</div>
            <p className="mt-4 font-semibold text-[#3d2b1f]">{step.title}</p>
            <p className="mt-2 text-sm text-[#6b5c4a]">{step.desc}</p>
          </SectionCard>
        ))}
      </div>
      <div className="mt-12 rounded-lg border border-[#e5ded1] bg-[#f6f1e8] p-8 text-center">
        <p className="text-lg font-semibold">See the workflow in action</p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/tenders"><Button>View Open Tenders</Button></Link>
          <Link to="/register/bidder"><Button variant="secondary">Bidder Registration</Button></Link>
        </div>
      </div>
    </PageContainer>
  );
}

export function About() {
  return (
    <PageContainer>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Nirnay AI</h1>
        <p className="mt-4 text-[#6b5c4a]">
          Nirnay AI is a prototype platform designed to modernize government procurement by combining a transparent
          tender publication process with AI-assisted bid compliance verification. The goal is to reduce manual
          document review effort, improve consistency in eligibility checks, and give bidders clear, actionable
          feedback throughout the submission process.
        </p>
        <p className="mt-4 text-[#6b5c4a]">
          This build is a frontend-only V1 prototype. All verification, compliance scoring and AI assessments shown
          in this demo are simulated using representative mock data. Future iterations are designed to connect to
          authoritative government systems including GST, PAN, Udyam, EPFO, ESIC and Income Tax verification
          services.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          ["Transparency", "Every compliance decision is traceable to a specific requirement or document."],
          ["Consistency", "The same verification standard is applied to every bidder, every time."],
          ["Officer authority", "AI assists review; procurement officers retain final decision-making authority."],
        ].map(([title, desc]) => (
          <SectionCard key={title}>
            <p className="font-semibold text-[#3d2b1f]">{title}</p>
            <p className="mt-2 text-sm text-[#6b5c4a]">{desc}</p>
          </SectionCard>
        ))}
      </div>
    </PageContainer>
  );
}

export function Help() {
  const faqs = [
    ["Is this a real government procurement portal?", "No. Nirnay AI is a frontend prototype built to demonstrate a procurement and compliance workflow. No real government integrations are active in this version."],
    ["How does AI verification work in this demo?", "Verification and compliance results shown here are simulated using mock data to represent how a production integration with GST, PAN, Udyam, EPFO and ESIC systems would function."],
    ["Can I register a real company?", "You can complete the registration flow to explore the experience, but no real data is verified or stored on a server."],
    ["Who can use the government portal?", "In production, government accounts require authorization before access is granted. In this prototype, government login is simulated for demonstration."],
  ];
  return (
    <PageContainer>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Help Center</h1>
        <p className="mt-3 text-[#6b5c4a]">Answers to common questions about the Nirnay AI prototype.</p>
      </div>
      <div className="mt-10 divide-y divide-[#e5ded1] rounded-lg border border-[#e5ded1] bg-white">
        {faqs.map(([q, a]) => (
          <div key={q} className="p-6">
            <p className="flex items-center gap-2 font-medium text-[#3d2b1f]"><HelpCircle size={16} className="text-[#8a5a35]" /> {q}</p>
            <p className="mt-2 text-sm text-[#6b5c4a]">{a}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <SectionCard>
          <p className="flex items-center gap-2 font-medium"><Mail size={16} /> Email Support</p>
          <p className="mt-2 text-sm text-[#6b5c4a]">support@bidsure.ai (demo contact — not monitored)</p>
        </SectionCard>
        <SectionCard>
          <p className="flex items-center gap-2 font-medium"><Phone size={16} /> Helpline</p>
          <p className="mt-2 text-sm text-[#6b5c4a]">1800-XXX-XXXX (demo contact — not monitored)</p>
        </SectionCard>
      </div>
    </PageContainer>
  );
}

export function PortalChoice() {
  return (
    <PageContainer className="max-w-3xl">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose Portal</h1>
        <p className="mt-3 text-[#6b5c4a]">Select how you would like to register on Nirnay AI.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[#e5ded1] bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#f1ece2]">
            <Gavel size={22} className="text-[#3d2b1f]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Government Procurement Officer</h3>
          <p className="mt-2 text-sm text-[#6b5c4a]">For authorized government procurement officials.</p>
          <Link to="/register/government">
            <Button className="mt-5 w-full">Government Registration <ArrowRight size={15} /></Button>
          </Link>
        </div>
        <div className="rounded-lg border border-[#e5ded1] bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#f1ece2]">
            <Building2 size={22} className="text-[#3d2b1f]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Bidder / Supplier</h3>
          <p className="mt-2 text-sm text-[#6b5c4a]">For companies participating in government tenders.</p>
          <Link to="/register/bidder">
            <Button className="mt-5 w-full" variant="secondary">Bidder Registration <ArrowRight size={15} /></Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

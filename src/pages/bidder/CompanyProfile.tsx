import { ShieldCheck } from "lucide-react";
import { PageContainer, SectionCard, StatusBadge } from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function CompanyProfile() {
  const { currentCompany } = useApp();
  if (!currentCompany) return null;
  const c = currentCompany;

  const fields: [string, string][] = [
    ["Legal Business Name", c.legalName],
    ["CIN / Registration Number", c.cin],
    ["PAN", c.pan],
    ["GSTIN", c.gstin],
    ["Udyam Registration Number", c.udyam],
    ["Business Type", c.businessType],
    ["Registered Address", c.address],
    ["State", c.state],
    ["District", c.district],
    ["Contact Person", c.contactPerson],
    ["Official Email", c.email],
    ["Phone", c.phone],
    ["Website", c.website],
    ["Year Established", c.yearEstablished],
    ["Primary Business Category", c.category],
  ];

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{c.name}</h1>
          <p className="mt-2 text-[#6b5c4a]">Company profile used across your bid submissions.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#c9e2cb] bg-[#eaf3ea] px-3.5 py-1.5 text-sm font-medium text-[#2f6b3a]">
          <ShieldCheck size={16} /> {c.overallVerified ? "Organization Verified" : "Verification Pending"}
        </div>
      </div>

      <SectionCard className="mt-8">
        <h2 className="text-lg font-semibold">Company Information</h2>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">{label}</dt>
              <dd className="mt-1 text-sm text-[#3d2b1f]">{value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard className="mt-6">
        <h2 className="text-lg font-semibold">Verification Status</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(c.verification).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-4 py-3">
              <span className="text-sm font-medium capitalize text-[#3d2b1f]">{key === "gst" ? "GST" : key === "pan" ? "PAN" : key === "udyam" ? "Udyam / MSME" : "Company Registration"}</span>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  );
}

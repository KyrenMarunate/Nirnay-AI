import { PageContainer, SectionCard, Button, Notice } from "../../components/ui";

export default function GovSettings() {
  return (
    <PageContainer className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-[#6b5c4a]">Manage your officer profile and integration preferences.</p>

      <SectionCard className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Officer Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Full Name</label>
            <input defaultValue="Anjali Sharma" className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Department</label>
            <input defaultValue="Directorate General of Health Services" className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
          </div>
        </div>
        <Button variant="secondary">Save Changes</Button>
      </SectionCard>

      <SectionCard className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Data Integrations</h2>
        <p className="text-sm text-[#6b5c4a]">These integrations are planned for a future release and are not active in this prototype.</p>
        {["GST Network", "PAN / Income Tax", "Udyam Registration", "EPFO", "ESIC", "GeM Portal"].map((label) => (
          <div key={label} className="flex items-center justify-between rounded-md border border-[#e5ded1] px-4 py-3 text-sm">
            <span className="text-[#3d2b1f]">{label}</span>
            <span className="rounded-full border border-[#e0d6c5] bg-[#f1ece2] px-2.5 py-1 text-xs font-medium text-[#7a6a55]">Not Connected</span>
          </div>
        ))}
      </SectionCard>

      <div className="mt-6">
        <Notice>This is a frontend prototype. Settings changes are not persisted to a backend.</Notice>
      </div>
    </PageContainer>
  );
}

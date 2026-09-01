import { PageContainer, SectionCard, Button, Notice } from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function BidderSettings() {
  const { currentCompany } = useApp();
  return (
    <PageContainer className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-[#6b5c4a]">Manage your account and notification preferences.</p>

      <SectionCard className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Contact Person</label>
            <input defaultValue={currentCompany?.contactPerson} className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Email</label>
            <input defaultValue={currentCompany?.email} className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]" />
          </div>
        </div>
        <Button variant="secondary">Save Changes</Button>
      </SectionCard>

      <SectionCard className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {["Bid status updates", "Compliance alerts", "New relevant tenders"].map((label) => (
          <label key={label} className="flex items-center justify-between text-sm text-[#3d2b1f]">
            {label}
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#3d2b1f]" />
          </label>
        ))}
      </SectionCard>

      <div className="mt-6">
        <Notice>This is a frontend prototype. Settings changes are not persisted to a backend.</Notice>
      </div>
    </PageContainer>
  );
}

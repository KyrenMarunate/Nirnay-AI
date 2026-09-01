import { Link } from "react-router-dom";
import { PageContainer, StatusBadge, Button, DataTable } from "../../components/ui";
import { companies } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function GovBidders() {
  const { bidsState } = useApp();

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Registered Bidders</h1>
      <p className="mt-2 text-[#6b5c4a]">Companies registered on the platform and their current verification status.</p>

      <div className="mt-8">
        <DataTable
          rows={companies}
          getRowKey={(company) => company.id}
          columns={[
            {
              key: "name",
              header: "Company",
              className: "min-w-[240px]",
              render: (company) => (
                <div>
                  <p className="font-medium text-[#3d2b1f]">{company.name}</p>
                  <p className="text-xs text-[#8a7c68]">{company.gstin}</p>
                </div>
              ),
            },
            { key: "category", header: "Category", className: "min-w-[170px]" },
            { key: "state", header: "State", className: "min-w-[140px]" },
            {
              key: "verification",
              header: "Verification",
              className: "min-w-[170px]",
              render: (company) => (
                <StatusBadge status={company.overallVerified ? "verified" : "warning"} label={company.overallVerified ? "Verified" : "Needs Review"} />
              ),
            },
            {
              key: "activeBids",
              header: "Active Bids",
              className: "min-w-[120px]",
              render: (company) => bidsState.filter((b) => b.bidderId === company.id).length,
            },
            {
              key: "action",
              header: "",
              className: "w-[120px] text-right",
              render: (company) => {
                const activeBids = bidsState.filter((b) => b.bidderId === company.id);
                const firstBid = activeBids[0];

                return firstBid ? (
                  <Link to={`/gov/tenders/${encodeURIComponent(firstBid.tenderId)}/bidders/${company.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                ) : (
                  <span className="text-xs text-[#c3b9a5]">No active bids</span>
                );
              },
            },
          ]}
        />
      </div>
    </PageContainer>
  );
}

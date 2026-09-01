import { Link } from "react-router-dom";
import { PageContainer, Button, TenderStatusBadge, SectionCard } from "../../components/ui";
import { tenders } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function BidderAvailableTenders() {
  const { bidsState, currentCompany } = useApp();
  const openTenders = tenders.filter((t) => t.status === "Open" || t.status === "Under Evaluation");

  const alreadyBid = (tenderId: string) => bidsState.some((b) => b.tenderId === tenderId && b.bidderId === currentCompany?.id);

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Available Government Tenders</h1>
      <p className="mt-2 text-[#6b5c4a]">Browse relevant procurement opportunities and submit your bid.</p>

      <div className="mt-8 flex flex-col gap-4">
        {openTenders.map((tender) => (
          <SectionCard key={tender.id}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{tender.title}</h3>
                  <TenderStatusBadge status={tender.status} />
                </div>
                <p className="mt-1 text-sm text-[#6b5c4a]">{tender.ministry}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#8a7c68] sm:grid-cols-4">
                  <div><dt className="font-medium text-[#5b4a3a]">Category</dt><dd>{tender.category}</dd></div>
                  <div><dt className="font-medium text-[#5b4a3a]">Quantity</dt><dd>{tender.requiredQuantity.toLocaleString("en-IN")} units</dd></div>
                  <div><dt className="font-medium text-[#5b4a3a]">Deadline</dt><dd>{tender.closingDate}</dd></div>
                  <div><dt className="font-medium text-[#5b4a3a]">Delivery</dt><dd>{tender.deliveryPeriod}</dd></div>
                </dl>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Link to={`/bidder/tenders/${encodeURIComponent(tender.id)}`}>
                  <Button variant="secondary">View Details</Button>
                </Link>
                {alreadyBid(tender.id) ? (
                  <Button variant="ghost" disabled>Bid Submitted</Button>
                ) : (
                  <Link to={`/bidder/tenders/${encodeURIComponent(tender.id)}/bid`}>
                    <Button>View & Bid</Button>
                  </Link>
                )}
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </PageContainer>
  );
}

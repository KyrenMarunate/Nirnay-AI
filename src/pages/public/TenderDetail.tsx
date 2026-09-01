import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, FileText, CalendarDays, MapPin, Package } from "lucide-react";
import { PageContainer, Button, TenderStatusBadge, SectionCard } from "../../components/ui";
import { tenders } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

export default function TenderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useApp();
  const tender = tenders.find((t) => t.id === decodeURIComponent(id ?? ""));
  const isBidderContext = location.pathname.startsWith("/bidder/");

  if (!tender) {
    return (
      <PageContainer>
        <p className="text-[#6b5c4a]">Tender not found.</p>
        <Link to={isBidderContext ? "/bidder/tenders" : "/tenders"} className="text-sm font-medium text-[#3d2b1f] underline">
          {isBidderContext ? "Back to Available Tenders" : "Back to Open Tenders"}
        </Link>
      </PageContainer>
    );
  }

  const handleSubmitBid = () => {
    if (role === "bidder") {
      navigate(`/bidder/tenders/${encodeURIComponent(tender.id)}/bid`);
    } else {
      navigate("/register/bidder");
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Link to={isBidderContext ? "/bidder/tenders" : "/tenders"} className="text-sm font-medium text-[#3d2b1f] underline underline-offset-2">
          {isBidderContext ? "Back to Available Tenders" : "Back to Open Tenders"}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{tender.title}</h1>
          <TenderStatusBadge status={tender.status} />
        </div>
        <p className="text-[#6b5c4a]">{tender.ministry} · {tender.department}</p>
        <p className="font-mono text-sm text-[#8a7c68]">Tender ID: {tender.id}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><CalendarDays size={18} /> Important Dates</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Published", tender.publishedDate],
                ["Bid Submission Deadline", tender.closingDate],
                ["Evaluation", tender.evaluationDate],
                ["Expected Decision", tender.decisionDate],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">{label}</p>
                  <p className="mt-1 text-sm font-medium text-[#3d2b1f]">{value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="text-lg font-semibold">Eligibility Requirements</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {tender.eligibility.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#3d2b1f]">
                  <CheckCircle2 size={16} className="text-[#2f6b3a]" /> {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText size={18} /> Required Documents</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {tender.requiredDocuments.map((doc) => (
                <li key={doc} className="flex items-center gap-2 text-sm text-[#5b4a3a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8a5a35]" /> {doc}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Package size={18} /> Procurement Requirements</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Product</p>
                <p className="mt-1 text-sm text-[#3d2b1f]">{tender.product}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Required Quantity</p>
                <p className="mt-1 text-sm text-[#3d2b1f]">{tender.requiredQuantity.toLocaleString("en-IN")} units</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Required Specifications</p>
                <p className="mt-1 text-sm text-[#3d2b1f]">{tender.specifications}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#8a5a35]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Delivery Location</p>
                  <p className="text-sm text-[#3d2b1f]">{tender.deliveryLocation}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#a4977f]">Delivery Period</p>
                <p className="mt-1 text-sm text-[#3d2b1f]">{tender.deliveryPeriod}</p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-[#e5ded1] bg-white p-6">
            <p className="text-sm font-medium text-[#5b4a3a]">Ready to participate?</p>
            <p className="mt-2 text-sm text-[#8a7c68]">
              Submit your organization's bid for this tender. Registered and verified bidders can submit directly.
            </p>
            <Button className="mt-5 w-full" onClick={handleSubmitBid}>
              Submit Bid
            </Button>
            {role !== "bidder" && (
              <Link to="/register/bidder" className="mt-3 block text-center text-sm font-medium text-[#3d2b1f] underline underline-offset-2">
                Register as Bidder
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

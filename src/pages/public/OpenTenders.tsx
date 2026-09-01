import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { PageContainer, Button, TenderStatusBadge, EmptyState } from "../../components/ui";
import { tenders } from "../../data/mockData";

export default function OpenTenders() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("All");

  const departments = ["All", ...Array.from(new Set(tenders.map((t) => t.ministry)))];
  const categories = ["All", ...Array.from(new Set(tenders.map((t) => t.category)))];
  const states = ["All", ...Array.from(new Set(tenders.map((t) => t.state)))];

  const filtered = useMemo(() => {
    return tenders.filter((t) => {
      const matchesSearch =
        search.trim() === "" ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === "All" || t.ministry === department;
      const matchesCat = category === "All" || t.category === category;
      const matchesState = state === "All" || t.state === state;
      return matchesSearch && matchesDept && matchesCat && matchesState;
    });
  }, [search, department, category, state]);

  return (
    <PageContainer>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Open Government Tenders</h1>
        <p className="mt-3 text-[#6b5c4a]">Browse currently available procurement opportunities and submit eligible bids.</p>
      </div>

      <div className="mt-8 rounded-lg border border-[#e5ded1] bg-white p-5">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a4977f]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tender title or ID..."
            aria-label="Search tenders"
            className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#8a5a35]"
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Filter label="Department" value={department} onChange={setDepartment} options={departments} />
          <Filter label="Category" value={category} onChange={setCategory} options={categories} />
          <Filter label="State" value={state} onChange={setState} options={states} />
          <div>
            <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Closing Date</label>
            <select className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2 px-3 text-sm outline-none focus:border-[#8a5a35]">
              <option>Any time</option>
              <option>Next 7 days</option>
              <option>Next 30 days</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-[#8a7c68]">{filtered.length} tender{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="mt-4 flex flex-col gap-4">
        {filtered.map((tender) => (
          <div key={tender.id} className="rounded-lg border border-[#e5ded1] bg-white p-6 transition-shadow hover:shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{tender.title}</h3>
                </div>
                <p className="mt-1 text-sm text-[#6b5c4a]">{tender.ministry}</p>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#8a7c68]">
                  <div className="flex gap-1">
                    <dt className="font-medium text-[#5b4a3a]">Tender ID:</dt>
                    <dd className="font-mono">{tender.id}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-[#5b4a3a]">Category:</dt>
                    <dd>{tender.category}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-[#5b4a3a]">Closing Date:</dt>
                    <dd>{tender.closingDate}</dd>
                  </div>
                </dl>
              </div>
              <Link to={`/tenders/${encodeURIComponent(tender.id)}`} className="shrink-0">
                <Button variant="secondary">View Tender</Button>
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState title="No tenders match your filters" description="Try adjusting your search or filter criteria." />}
      </div>
    </PageContainer>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#8a7c68]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2 px-3 text-sm outline-none focus:border-[#8a5a35]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gavel, Building2 } from "lucide-react";
import { Button, PageContainer, Notice } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { companies } from "../../data/mockData";

export function GovernmentLogin() {
  const navigate = useNavigate();
  const { loginAsGovernment } = useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAsGovernment();
      navigate("/gov");
    }, 700);
  };

  return (
    <PageContainer className="max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#f1ece2]">
          <Gavel size={22} className="text-[#3d2b1f]" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Government Officer Login</h1>
        <p className="mt-2 text-sm text-[#6b5c4a]">Access the procurement dashboard.</p>
      </div>
      <form onSubmit={handleLogin} className="mt-8 space-y-4 rounded-lg border border-[#e5ded1] bg-white p-6">
        <Field label="Official Email" type="email" placeholder="officer@gov.in" defaultValue="officer@dghs.gov.in" />
        <Field label="Password" type="password" placeholder="••••••••" defaultValue="password" />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <Notice>This is a simulated login for demonstration. No real credentials are verified.</Notice>
      </form>
      <p className="mt-5 text-center text-sm text-[#8a7c68]">
        Not registered? <Link to="/register/government" className="font-medium text-[#3d2b1f] underline">Register as Government Officer</Link>
      </p>
    </PageContainer>
  );
}

export function BidderLogin() {
  const navigate = useNavigate();
  const { loginAsBidder } = useApp();
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(companies[0].id);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAsBidder(companyId);
      navigate("/bidder");
    }, 700);
  };

  return (
    <PageContainer className="max-w-md">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#f1ece2]">
          <Building2 size={22} className="text-[#3d2b1f]" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Bidder Login</h1>
        <p className="mt-2 text-sm text-[#6b5c4a]">Access your organization's bidder portal.</p>
      </div>
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        className="mt-8 space-y-4 rounded-lg border border-[#e5ded1] bg-white p-6"
      >
        <Field label="Registered Email" type="email" placeholder="you@company.com" defaultValue="rohan.mehta@apexmedical.co.in" />
        <Field label="Password" type="password" placeholder="••••••••" defaultValue="password" />
        <div>
          <label className="mb-1 block text-xs font-medium text-[#8a7c68]">Demo Company (for prototype)</label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full rounded-md border border-[#d8cfc2] bg-[#fbf9f5] py-2.5 px-3 text-sm outline-none focus:border-[#8a5a35]"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <Notice>This is a simulated login for demonstration. No real credentials are verified.</Notice>
      </motion.form>
      <p className="mt-5 text-center text-sm text-[#8a7c68]">
        Not registered? <Link to="/register/bidder" className="font-medium text-[#3d2b1f] underline">Register as Bidder</Link>
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



import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { bids as initialBids, companies, type Bid, type Company } from "../data/mockData";

type Role = "guest" | "bidder" | "government";

interface AppState {
  role: Role;
  currentCompany: Company | null;
  bidsState: Bid[];
  loginAsBidder: (companyId?: string) => void;
  loginAsGovernment: () => void;
  logout: () => void;
  updateBid: (bidId: string, patch: Partial<Bid>) => void;
  addBid: (bid: Bid) => void;
  verifyCompany: (companyId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>("apex-medical");
  const [bidsState, setBidsState] = useState<Bid[]>(initialBids);
  const [companyList, setCompanyList] = useState<Company[]>(companies);

  const currentCompany = useMemo(
    () => companyList.find((c) => c.id === currentCompanyId) ?? null,
    [companyList, currentCompanyId]
  );

  const value: AppState = {
    role,
    currentCompany,
    bidsState,
    loginAsBidder: (companyId = "apex-medical") => {
      setCurrentCompanyId(companyId);
      setRole("bidder");
    },
    loginAsGovernment: () => setRole("government"),
    logout: () => setRole("guest"),
    updateBid: (bidId, patch) => {
      setBidsState((prev) => prev.map((b) => (b.id === bidId ? { ...b, ...patch } : b)));
    },
    addBid: (bid) => {
      setBidsState((prev) => [...prev, bid]);
    },
    verifyCompany: (companyId) => {
      setCompanyList((prev) =>
        prev.map((c) =>
          c.id === companyId
            ? { ...c, overallVerified: true, verification: { gst: "verified", pan: "verified", udyam: "verified", company: "verified" } }
            : c
        )
      );
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

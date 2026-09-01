import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import {
  LayoutGrid,
  FileText,
  FolderCheck,
  Building2,
  ClipboardCheck,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../utils/cn";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const bidderNav: NavItem[] = [
  { to: "/bidder", label: "Overview", icon: <LayoutGrid size={17} /> },
  { to: "/bidder/tenders", label: "Available Tenders", icon: <FileText size={17} /> },
  { to: "/bidder/bids", label: "My Bids", icon: <ClipboardCheck size={17} /> },
  { to: "/bidder/documents", label: "Documents", icon: <FolderCheck size={17} /> },
  { to: "/bidder/profile", label: "Company Profile", icon: <Building2 size={17} /> },
  { to: "/bidder/compliance", label: "Compliance", icon: <BarChart3 size={17} /> },
  { to: "/bidder/settings", label: "Settings", icon: <Settings size={17} /> },
];

const govNav: NavItem[] = [
  { to: "/gov", label: "Overview", icon: <LayoutGrid size={17} /> },
  { to: "/gov/tenders", label: "Review Tenders", icon: <FileText size={17} /> },
  { to: "/gov/bidders", label: "Bidders", icon: <Users size={17} /> },
  { to: "/gov/compliance", label: "Compliance", icon: <ClipboardCheck size={17} /> },
  { to: "/gov/documents", label: "Documents", icon: <FolderCheck size={17} /> },
  { to: "/gov/reports", label: "Reports", icon: <BarChart3 size={17} /> },
  { to: "/gov/settings", label: "Settings", icon: <Settings size={17} /> },
];

function PortalShell({ items, badge, brand }: { items: NavItem[]; badge: string; brand: string }) {
  const navigate = useNavigate();
  const { logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (onNavigate?: () => void) => (
    <nav className="flex flex-1 flex-col gap-1.5 p-3" aria-label="Portal navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          end={item.to === "/bidder" || item.to === "/gov"}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive ? "text-[#3d2b1f]" : "text-[#5b4a3a] hover:bg-[#f3ebdf] hover:text-[#3d2b1f]"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#f0dcc0] via-[#eedbb9] to-[#e9d9bf] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />
              )}
              <span
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-lg border transition-all",
                  isActive
                    ? "border-[#d8c6a4] bg-gradient-to-br from-white/80 to-[#eedbb9] text-[#3d2b1f] shadow-[0_0_12px_rgba(244,211,157,0.4)]"
                    : "border-[#e6dcc7] bg-[#fbf9f5] text-[#5b4a3a]"
                )}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-transparent text-[#211b17]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-[#e7dfd2] bg-[#f7f0e6]/85 text-[#3d2b1f] shadow-[18px_0_40px_rgba(90,74,54,0.06)] lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-[#e7dfd2] px-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3d2b1f] text-[#f8f3ee] shadow-[0_10px_30px_rgba(61,43,31,0.18)]">
            <img src="/nirnay.svg" alt="Nirnay AI" className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="brand-name text-base font-400 tracking-tight">{brand}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a7c68]">{badge}</p>
          </div>
        </div>
        {navContent()}
        <div className="mt-auto border-t border-[#e7dfd2] p-3">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#e7dfd2] bg-white px-3 py-2.5 text-sm font-medium text-[#3d2b1f] transition-colors hover:bg-[#f3ebdf]"
          >
            <LogOut size={17} />
            Exit Portal
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e7dfd2] bg-[#fbf9f5]/80 px-6 backdrop-blur-xl lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-[#211b17]">
            <img src="/nirnay.svg" alt="Nirnay AI" className="h-5 w-5" /> Nirnay AI
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8a7c68]">{badge}</span>
            <button aria-label="Toggle navigation" onClick={() => setMobileOpen((v) => !v)} className="p-1.5 text-[#211b17]">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
        {mobileOpen && (
          <div className="border-b border-[#e7dfd2] bg-[#fbf9f5]/80 lg:hidden">
            <div className="bg-[#111315] text-white">
              {navContent(() => setMobileOpen(false))}
            </div>
            <div className="border-t border-[#e7dfd2] p-3">
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#e7dfd2] bg-white px-3 py-2.5 text-sm font-medium text-[#211b17] hover:bg-[#f5f1ea]"
              >
                <LogOut size={17} />
                Exit Portal
              </button>
            </div>
          </div>
        )}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function BidderPortalLayout() {
  return <PortalShell items={bidderNav} badge="Bidder Portal" brand="Nirnay AI" />;
}

export function GovPortalLayout() {
  return <PortalShell items={govNav} badge="Government Portal" brand="Nirnay AI" />;
}

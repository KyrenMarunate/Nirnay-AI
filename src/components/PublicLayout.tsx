import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7dfd2] bg-[#fbf9f5]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1240px] px-4 pt-4 lg:px-6">
        <div className="flex items-center justify-between gap-3 rounded-[30px] border border-[#e7dfd2] bg-[#f3ede4]/90 px-3 py-2 shadow-[0_10px_30px_rgba(90,74,54,0.06)]">
          <Link to="/" className="flex items-center gap-3 pl-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3d2b1f] text-[#f8f3ee] shadow-[0_10px_22px_rgba(61,43,31,0.18)]">
              <img src="/nirnay.svg" alt="Nirnay AI" className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <div className="brand-name text-xl font-400 tracking-tight text-[#3d2b1f]">Nirnay AI</div>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 rounded-full bg-[#f0e8de] p-1 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive ? "bg-white text-[#3d2b1f] shadow-sm" : "text-[#6b5c4a] hover:text-[#3d2b1f]"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className={isActive ? "relative z-10" : ""}>{link.label}</span>
                )}
              </NavLink>
            ))}
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-white text-[#3d2b1f] shadow-sm" : "text-[#6b5c4a] hover:text-[#3d2b1f]"
                }`
              }
            >
              {({ isActive }) => <span className={isActive ? "relative z-10" : ""}>Know more</span>}
            </NavLink>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => navigate("/register/government")}
              className="flex h-[52px] min-w-[170px] items-center justify-center rounded-[18px] border border-[#d8cbb8] bg-[#f8f5f2] px-4 text-sm font-medium text-[#3d2b1f] transition-all hover:border-[#c4b69d] hover:bg-[#f4efe9]"
            >
              Government Registration
            </button>
            <button
              type="button"
              onClick={() => navigate("/register/bidder")}
              className="flex h-[52px] min-w-[170px] items-center justify-center rounded-[18px] border border-[#d8cbb8] bg-[#f8f5f2] px-4 text-sm font-medium text-[#3d2b1f] transition-all hover:border-[#c4b69d] hover:bg-[#f4efe9]"
            >
              Bidder Registration
            </button>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7dfd2] bg-white p-0 lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-[24px] border border-[#e7dfd2] bg-[#fbf9f5] px-4 py-4 shadow-[0_12px_28px_rgba(90,74,54,0.08)] lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-[#f3ebdf] text-[#3d2b1f]" : "text-[#6b5c4a] hover:bg-[#f1ece2]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" onClick={() => navigate("/register")}>
              Know more
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate("/register/government")}>
              Government Registration
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate("/register/bidder")}>
              Bidder Registration
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-[#e5ded1] bg-[#fbf9f5]">
      <div className="mx-auto max-w-[1240px] px-6 py-10 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3d2b1f] text-white">
                <img src="/nirnay.svg" alt="Nirnay AI" className="h-5 w-5" />
              </span>
              <span className="brand-name text-sm font-400 text-[#3d2b1f]">Nirnay AI</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-[#8a7c68]">
              AI-assisted bid compliance and procurement platform connecting government departments with verified bidders.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="font-medium text-[#3d2b1f]">Platform</p>
              <ul className="mt-3 space-y-2 text-[#8a7c68]">
                <li><Link to="/about" className="hover:text-[#3d2b1f]">About</Link></li>
                <li><Link to="/register" className="hover:text-[#3d2b1f]">Know more</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-[#3d2b1f]">Access</p>
              <ul className="mt-3 space-y-2 text-[#8a7c68]">
                <li><Link to="/register" className="hover:text-[#3d2b1f]">Register</Link></li>
                <li><Link to="/register/government" className="hover:text-[#3d2b1f]">Government Registration</Link></li>
                <li><Link to="/register/bidder" className="hover:text-[#3d2b1f]">Bidder Registration</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-[#3d2b1f]">Support</p>
              <ul className="mt-3 space-y-2 text-[#8a7c68]">
                <li><Link to="/help" className="hover:text-[#3d2b1f]">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-[#e5ded1] pt-6 text-xs text-[#a4977f] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nirnay AI. A frontend prototype for demonstration purposes only.</p>
          <p>Not affiliated with any real government procurement authority.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-[#3d2b1f]">
      <PublicHeader />
      <main className="flex-1 bg-transparent">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

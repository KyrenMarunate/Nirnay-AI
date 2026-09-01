import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import PublicLayout from "./components/PublicLayout";
import { BidderPortalLayout, GovPortalLayout } from "./components/PortalLayout";

import Landing from "./pages/public/Landing";
import OpenTenders from "./pages/public/OpenTenders";
import TenderDetail from "./pages/public/TenderDetail";
import { HowItWorks, About, Help, PortalChoice } from "./pages/public/StaticPages";
import { GovernmentLogin, BidderLogin } from "./pages/public/Login";
import GovernmentRegister from "./pages/public/GovernmentRegister";
import BidderRegister from "./pages/public/BidderRegister";

import BidderOverview from "./pages/bidder/Overview";
import BidderAvailableTenders from "./pages/bidder/AvailableTenders";
import BidSubmission from "./pages/bidder/BidSubmission";
import MyBids from "./pages/bidder/MyBids";
import BidStatus from "./pages/bidder/BidStatus";
import BidderDocuments from "./pages/bidder/Documents";
import CompanyProfile from "./pages/bidder/CompanyProfile";
import BidderCompliance from "./pages/bidder/Compliance";
import BidderSettings from "./pages/bidder/Settings";

import GovOverview from "./pages/gov/Overview";
import ReviewTenders from "./pages/gov/ReviewTenders";
import TenderReview from "./pages/gov/TenderReview";
import GovBidderDetail from "./pages/gov/BidderDetail";
import GovBidders from "./pages/gov/Bidders";
import GovDocuments from "./pages/gov/Documents";
import GovCompliance from "./pages/gov/Compliance";
import GovReports from "./pages/gov/Reports";
import GovReportDetail from "./pages/gov/ReportDetail";
import GovSettings from "./pages/gov/Settings";

function RequireBidder({ children }: { children: React.ReactNode }) {
  const { role } = useApp();
  if (role !== "bidder") return <Navigate to="/login/bidder" replace />;
  return <>{children}</>;
}

function RequireGov({ children }: { children: React.ReactNode }) {
  const { role } = useApp();
  if (role !== "government") return <Navigate to="/login/government" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/tenders" element={<OpenTenders />} />
        <Route path="/tenders/:id" element={<TenderDetail />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/register" element={<PortalChoice />} />
        <Route path="/register/government" element={<GovernmentRegister />} />
        <Route path="/register/bidder" element={<BidderRegister />} />
        <Route path="/login/government" element={<GovernmentLogin />} />
        <Route path="/login/bidder" element={<BidderLogin />} />
      </Route>

      <Route
        element={
          <RequireBidder>
            <BidderPortalLayout />
          </RequireBidder>
        }
      >
        <Route path="/bidder" element={<BidderOverview />} />
        <Route path="/bidder/tenders" element={<BidderAvailableTenders />} />
        <Route path="/bidder/tenders/:id/bid" element={<BidSubmission />} />
        <Route path="/bidder/bids" element={<MyBids />} />
        <Route path="/bidder/bids/:bidId" element={<BidStatus />} />
        <Route path="/bidder/documents" element={<BidderDocuments />} />
        <Route path="/bidder/profile" element={<CompanyProfile />} />
        <Route path="/bidder/compliance" element={<BidderCompliance />} />
        <Route path="/bidder/settings" element={<BidderSettings />} />
      </Route>

      <Route
        element={
          <RequireGov>
            <GovPortalLayout />
          </RequireGov>
        }
      >
        <Route path="/gov" element={<GovOverview />} />
        <Route path="/gov/tenders" element={<ReviewTenders />} />
        <Route path="/gov/tenders/:id" element={<TenderReview />} />
        <Route path="/gov/tenders/:id/bidders/:bidderId" element={<GovBidderDetail />} />
        <Route path="/gov/bidders" element={<GovBidders />} />
        <Route path="/gov/documents" element={<GovDocuments />} />
        <Route path="/gov/compliance" element={<GovCompliance />} />
        <Route path="/gov/reports" element={<GovReports />} />
        <Route path="/gov/reports/:id" element={<GovReportDetail />} />
        <Route path="/gov/settings" element={<GovSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function CircleCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: coarse)");
    if (media.matches) return;

    document.body.style.cursor = "none";

    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const updateHover = () => {
      const interactive = document.querySelectorAll("a, button, [role='button']");
      interactive.forEach((element) => {
        const onEnter = () => setHovering(true);
        const onExit = () => setHovering(false);
        element.addEventListener("mouseenter", onEnter);
        element.addEventListener("mouseleave", onExit);
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    updateHover();

    const observer = new MutationObserver(updateHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      observer.disconnect();
      document.body.style.cursor = "auto";
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full bg-white/90"
        style={{ width: 8, height: 8, x: position.x - 4, y: position.y - 4, zIndex: 99999, mixBlendMode: "difference" }}
        animate={{ opacity: hidden ? 0 : 1, scale: clicking ? 0.7 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full border border-white/80 bg-transparent"
        style={{ width: 34, height: 34, x: position.x - 17, y: position.y - 17, zIndex: 99998, mixBlendMode: "difference" }}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: hovering ? 1.45 : clicking ? 0.82 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <CircleCursor />
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}

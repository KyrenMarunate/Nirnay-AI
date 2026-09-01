import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileSearch, ScanSearch, Gavel, ArrowRight, Building2, Users2, ShieldCheck } from "lucide-react";
import { Button, PageContainer } from "../../components/ui";
import { tenders } from "../../data/mockData";

const steps = [
  {
    icon: <FileSearch size={20} />,
    title: "Government publishes requirements",
    desc: "Departments publish tenders with eligibility criteria, required documents and technical specifications.",
  },
  {
    icon: <Building2 size={20} />,
    title: "Bidder registers & verifies",
    desc: "Companies register their organization and complete AI-assisted verification against official records.",
  },
  {
    icon: <ScanSearch size={20} />,
    title: "AI-assisted compliance check",
    desc: "Submitted documents, quotations and proposals are automatically cross-checked for consistency.",
  },
  {
    icon: <Gavel size={20} />,
    title: "Government reviews & decides",
    desc: "Procurement officers compare bidders, inspect compliance and approve the final selection.",
  },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(244,211,157,0.2),_transparent_60%)]" />

      <section className="relative border-b border-[#e5ded1] bg-transparent">
        <PageContainer className="relative py-16 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-[#dcc9ae] bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#5d483b] shadow-[0_8px_24px_rgba(90,74,54,0.05)] backdrop-blur"
            >
              <img src="/nirnay.svg" alt="Nirnay AI" className="h-4 w-4" />
              AI-assisted public procurement platform
            </motion.div>

            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className="text-4xl font-semibold tracking-[-0.06em] text-[#2b1e15] sm:text-5xl lg:text-[4.2rem] lg:leading-[1.02]"
                >
                  Smarter Procurement.
                  <span className="mt-2 block text-[#6b5c4a]">Stronger Compliance.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                  className="mt-6 max-w-xl text-lg leading-8 text-[#6b5c4a]"
                >
                  AI-assisted workflows for transparent, secure and efficient government bid evaluation with Nirnay AI.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.18 }}
                  className="mt-8 flex flex-col items-start gap-3 sm:flex-row"
                >
                  <Link to="/register">
                    <Button size="lg">
                      Get Started <ArrowRight size={16} />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.24 }}
                  className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#6b5c4a]"
                >
                  <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#2f6b3a]" /> Verified workflows</div>
                  <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#2f6b3a]" /> Procurement-ready</div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative"
              >
                <div className="absolute -inset-3 rounded-[32px] bg-[radial-gradient(circle,_rgba(244,211,157,0.24),_transparent_65%)] blur-2xl" />
                <div className="relative overflow-hidden rounded-[28px] border border-[#e7dfd2] bg-white/85 p-5 shadow-[0_24px_60px_rgba(90,74,54,0.09)] backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-[#efe7dc] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3d2b1f] text-[#f8f3ee]">
                        <img src="/nirnay.svg" alt="Nirnay AI" className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#3d2b1f]">Procurement Dashboard</p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a7c68]">Live pipeline</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-[#d7ebdb] bg-[#eaf3ea] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2f6b3a]">
                      Active
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f8f3ee] p-4">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a7c68]">Open bids</p>
                      <p className="mt-2 text-3xl font-semibold text-[#3d2b1f]">128</p>
                    </div>
                    <div className="rounded-2xl bg-[#f8f3ee] p-4">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a7c68]">Compliance score</p>
                      <p className="mt-2 text-3xl font-semibold text-[#3d2b1f]">94%</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#efe7dc] bg-[#f9f6f2] p-4">
                    <div className="flex items-center justify-between text-sm text-[#6b5c4a]">
                      <span>Review queue</span>
                      <span className="font-semibold text-[#3d2b1f]">28 items</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {["Medical equipment", "IT infrastructure", "Urban mobility"].map((item, index) => (
                        <div key={item} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-[0_4px_12px_rgba(90,74,54,0.04)]">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-[#31EE33]" : index === 1 ? "bg-[#FFBB00]" : "bg-[#FF0000]"}`} />
                            <span className="text-sm text-[#3d2b1f]">{item}</span>
                          </div>
                          <span className="text-xs text-[#8a7c68]">{index + 1}m ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </PageContainer>

        <div className="border-t border-[#e5ded1] bg-[#3d2b1f]">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-2 px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck size={16} /> Government Procurement Portal
            </div>
            <p className="text-sm text-white/75">Official procurement opportunities and bid submissions.</p>
          </div>
        </div>
      </section>

      <PageContainer className="py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[26px] border border-[#e5ded1] bg-white p-8 shadow-[0_16px_32px_rgba(90,74,54,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1ece2]">
              <Gavel size={20} className="text-[#3d2b1f]" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#3d2b1f]">Government Procurement Officer</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b5c4a]">For authorized teams publishing, evaluating and approving tenders with clear visibility across the procurement lifecycle.</p>
            <Link to="/register/government" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f] transition-all hover:gap-2.5">
              Government Registration <ArrowRight size={15} />
            </Link>
          </div>
          <div className="rounded-[26px] border border-[#e5ded1] bg-white p-8 shadow-[0_16px_32px_rgba(90,74,54,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1ece2]">
              <Users2 size={20} className="text-[#3d2b1f]" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#3d2b1f]">Bidder / Supplier</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b5c4a]">For businesses discovering opportunities, managing compliance and submitting high-confidence bids to government departments.</p>
            <Link to="/register/bidder" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f] transition-all hover:gap-2.5">
              Bidder Registration <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </PageContainer>

      <section className="border-y border-[#e5ded1] bg-[#f6f1e8]">
        <PageContainer className="py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[#2b1e15]">How the platform works</h2>
            <p className="mt-3 text-[#6b5c4a]">A continuous compliance workflow between government and bidders.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-[24px] border border-[#e5ded1] bg-white p-6 shadow-[0_12px_30px_rgba(90,74,54,0.04)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1ece2] text-[#3d2b1f]">{step.icon}</div>
                <p className="mt-4 text-base font-semibold text-[#3d2b1f]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b5c4a]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>


    </div>
  );
}

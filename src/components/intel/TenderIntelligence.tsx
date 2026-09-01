import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, FileSearch } from "lucide-react";
import { Button } from "../ui";
import { MandatoryTag } from "./primitives";
import { ProcessingSequence, useProcessingRun } from "./ProcessingSequence";
import { RequirementDrawer } from "./RequirementDrawer";
import { tenderAnalysisSteps, type Requirement } from "../../data/intelligenceData";

/**
 * Shows that the tender document has been converted into structured,
 * comparable requirements — not merely read.
 */
export function TenderIntelligence({
  requirements,
  tenderTitle,
  analysedLabel,
}: {
  requirements: Requirement[];
  tenderTitle: string;
  analysedLabel?: string;
}) {
  const run = useProcessingRun(tenderAnalysisSteps.length, 620, "idle");
  const [openId, setOpenId] = useState<string | null>(null);
  const openRequirement = requirements.find((r) => r.id === openId) ?? null;

  const mandatoryCount = requirements.filter((r) => r.mandatory).length;
  const typeCounts = requirements.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
              <Sparkles size={17} className="text-[#8a5a35]" /> AI Tender Analysis
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[#6b5c4a]">
              NirnayAI reads {tenderTitle} and converts its clauses into structured requirements with machine-comparable
              rules. Officers can inspect every rule and the clause it came from.
            </p>
          </div>
          <Button
            variant={run.state === "done" ? "secondary" : "primary"}
            onClick={run.start}
            disabled={run.state === "running"}
            className="shrink-0"
          >
            <FileSearch size={16} />
            {run.state === "idle" ? "Analyze Tender" : run.state === "running" ? "Analyzing…" : "Re-run Analysis"}
          </Button>
        </div>

        {run.state !== "idle" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <ProcessingSequence
              steps={tenderAnalysisSteps}
              currentStep={run.currentStep}
              state={run.state}
              title="Analyzing Tender"
            />
          </motion.div>
        )}

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-[#f0ebe0] pt-4 text-sm">
          <div className="flex gap-2">
            <dt className="text-[#8a7c68]">Requirements structured:</dt>
            <dd className="font-medium text-[#3d2b1f]">{requirements.length}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-[#8a7c68]">Mandatory:</dt>
            <dd className="font-medium text-[#3d2b1f]">{mandatoryCount}</dd>
          </div>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} className="flex gap-2">
              <dt className="text-[#8a7c68]">{type}:</dt>
              <dd className="font-medium text-[#3d2b1f]">{count}</dd>
            </div>
          ))}
          {analysedLabel && (
            <div className="flex gap-2">
              <dt className="text-[#8a7c68]">Last analysed:</dt>
              <dd className="font-medium text-[#3d2b1f]">{analysedLabel}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
            <thead>
              <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Requirement</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Type</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Rule</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Mandatory</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium">Source Clause</th>
                <th className="border-b border-[#e8e0d6] px-5 py-3.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setOpenId(req.id)}
                  className="cursor-pointer border-b border-[#f0ebe0] transition-colors last:border-0 hover:bg-[#faf8f4]"
                >
                  <td className="px-5 py-4 font-medium text-[#3d2b1f]">{req.name}</td>
                  <td className="px-5 py-4 text-[#5b4a3a]">{req.type}</td>
                  <td className="px-5 py-4">
                    <code className="rounded-md border border-[#e5ded1] bg-[#f6f1e8] px-2 py-0.5 font-mono text-[12px] text-[#5b4a3a]">
                      {req.rule}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <MandatoryTag mandatory={req.mandatory} />
                  </td>
                  <td className="px-5 py-4 text-xs text-[#8a7c68]">{req.clauseRef}</td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight size={16} className="inline text-[#b3a892]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RequirementDrawer open={openId !== null} onClose={() => setOpenId(null)} requirement={openRequirement} />
    </div>
  );
}

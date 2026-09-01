import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, FileUp, Wrench, CheckCircle2 } from "lucide-react";
import { Button, Notice } from "../ui";
import { cn } from "../../utils/cn";
import { ProcessingSequence, useProcessingRun } from "./ProcessingSequence";
import { DocumentCompleteness } from "./DocumentCompleteness";
import { readinessScanSteps, type BidReadinessData } from "../../data/intelligenceData";

/**
 * Pre-submission risk scan for the bidder. It helps prevent avoidable
 * rejection — it is explicitly not an approval of the bid.
 */
export function BidReadinessPanel({
  data,
  onReadinessChange,
  autoStart = false,
}: {
  data: BidReadinessData;
  onReadinessChange?: (state: { scanned: boolean; readiness: number; criticalIssues: number }) => void;
  autoStart?: boolean;
}) {
  const run = useProcessingRun(readinessScanSteps.length, 560, "idle");
  const [resolved, setResolved] = useState<string[]>([]);

  useEffect(() => {
    if (autoStart) run.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const resolvedCount = resolved.length;
  const checklist = useMemo(
    () =>
      data.checklist.map((doc) =>
        doc.status === "missing" && resolved.includes("fix-oem")
          ? { ...doc, status: "present" as const, fileName: "OEM_Authorization_Letter.pdf", note: undefined }
          : doc
      ),
    [data.checklist, resolved]
  );

  const documentsPresent = checklist.filter((d) => d.status !== "missing").length;
  const coverage = Math.min(100, data.requirementCoverage + (resolved.includes("fix-oem") ? 4 : 0) + (resolved.includes("fix-warranty") ? 5 : 0));
  const readiness = Math.min(
    98,
    data.readiness + (resolved.includes("fix-oem") ? 12 : 0) + (resolved.includes("fix-warranty") ? 8 : 0)
  );
  const openFixes = data.fixes.filter((f) => !resolved.includes(f.id));
  const criticalIssues = openFixes.filter((f) => f.severity === "critical").length;
  const scanned = run.state === "done";

  useEffect(() => {
    onReadinessChange?.({ scanned, readiness, criticalIssues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanned, readiness, criticalIssues]);

  const metrics = [
    { label: "Document Completeness", value: `${documentsPresent} / ${data.checklist.length}`, tone: documentsPresent === data.checklist.length ? "text-[#2f6b3a]" : "text-[#9c6b1a]" },
    { label: "Requirement Coverage", value: `${coverage}%`, tone: coverage >= 95 ? "text-[#2f6b3a]" : "text-[#9c6b1a]" },
    { label: "Potential Issues", value: openFixes.length, tone: openFixes.length ? "text-[#9c6b1a]" : "text-[#2f6b3a]" },
    { label: "Critical Issues", value: criticalIssues, tone: criticalIssues ? "text-[#9c3131]" : "text-[#2f6b3a]" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
              <Gauge size={17} className="text-[#8a5a35]" /> AI Bid Readiness Check
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[#6b5c4a]">
              NirnayAI scans your documents against the tender's structured requirements so you can fix problems before
              submitting.
            </p>
          </div>
          <Button
            variant={scanned ? "secondary" : "primary"}
            onClick={run.start}
            disabled={run.state === "running"}
            className="shrink-0"
          >
            {run.state === "idle" ? "Run Readiness Check" : run.state === "running" ? "Scanning…" : "Re-run Check"}
          </Button>
        </div>

        {run.state !== "idle" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <ProcessingSequence
              steps={readinessScanSteps}
              currentStep={run.currentStep}
              state={run.state}
              title="Scanning your submission"
            />
          </motion.div>
        )}
      </div>

      {scanned && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-[#e5ded1] bg-[#e5ded1] lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-white p-5">
                <p className={cn("text-2xl font-semibold tracking-tight", metric.tone)}>{metric.value}</p>
                <p className="mt-1 text-sm text-[#6b5c4a]">{metric.label}</p>
              </div>
            ))}
          </div>

          <div
            className={cn(
              "rounded-[20px] border p-5",
              readiness >= 95 ? "border-[#c9e2cb] bg-[#f3f8f3]" : "border-[#f0dcb2] bg-[#fbf6ec]"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">Bid Readiness</p>
                <p className="mt-1 text-2xl font-semibold text-[#3d2b1f]">
                  {readiness}% —{" "}
                  <span className={readiness >= 95 ? "text-[#2f6b3a]" : "text-[#9c6b1a]"}>
                    {readiness >= 95 ? "Ready to Submit" : "Action Required"}
                  </span>
                </p>
              </div>
              <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white sm:w-56">
                <motion.div
                  className={cn("h-full rounded-full", readiness >= 95 ? "bg-[#2f6b3a]" : "bg-[#9c6b1a]")}
                  initial={{ width: 0 }}
                  animate={{ width: `${readiness}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {openFixes.length > 0 ? (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
                <Wrench size={17} className="text-[#8a5a35]" /> Fix Before Submission
              </h3>
              {openFixes.map((fix) => (
                <div
                  key={fix.id}
                  className={cn(
                    "rounded-[20px] border p-5",
                    fix.severity === "critical" ? "border-[#f0c9c9] bg-[#fdf4f4]" : "border-[#f0dcb2] bg-[#fbf6ec]"
                  )}
                >
                  <p
                    className={cn(
                      "text-base font-semibold",
                      fix.severity === "critical" ? "text-[#9c3131]" : "text-[#9c6b1a]"
                    )}
                  >
                    ⚠ {fix.title}
                  </p>
                  <p className="mt-1 text-sm text-[#5b4a3a]">{fix.description}</p>

                  {fix.requirementLabel && (
                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-[#e5ded1] bg-white px-3 py-2">
                        <dt className="text-[11px] uppercase tracking-[0.14em] text-[#a4977f]">Tender requires</dt>
                        <dd className="text-sm font-medium text-[#3d2b1f]">{fix.tenderValue}</dd>
                      </div>
                      <div className="rounded-md border border-[#e5ded1] bg-white px-3 py-2">
                        <dt className="text-[11px] uppercase tracking-[0.14em] text-[#a4977f]">Your proposal states</dt>
                        <dd className="text-sm font-medium text-[#3d2b1f]">{fix.bidderValue}</dd>
                      </div>
                    </dl>
                  )}

                  <Button
                    size="sm"
                    variant={fix.severity === "critical" ? "primary" : "secondary"}
                    className="mt-4"
                    onClick={() => setResolved((prev) => [...prev, fix.id])}
                  >
                    {fix.id === "fix-oem" && <FileUp size={15} />}
                    {fix.actionLabel}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-[20px] border border-[#c9e2cb] bg-[#eaf3ea] p-5 text-sm text-[#2f6b3a]">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">No outstanding issues detected</p>
                <p className="mt-1">
                  All flagged issues have been addressed. The procurement officer still performs the formal evaluation.
                </p>
              </div>
            </div>
          )}

          {resolvedCount > 0 && (
            <ul className="space-y-2">
              {data.fixes
                .filter((f) => resolved.includes(f.id))
                .map((fix) => (
                  <li
                    key={fix.id}
                    className="flex items-center gap-2 rounded-md border border-[#c9e2cb] bg-[#eaf3ea] px-3 py-2 text-sm text-[#2f6b3a]"
                  >
                    <CheckCircle2 size={15} /> {fix.resolvedNote}
                  </li>
                ))}
            </ul>
          )}

          <DocumentCompleteness
            checklist={checklist}
            mode="bidder"
            onUpload={() => setResolved((prev) => (prev.includes("fix-oem") ? prev : [...prev, "fix-oem"]))}
            title="Document Completeness"
          />

          <Notice>
            This readiness check is guidance only. It is not an approval of your bid — eligibility and award decisions
            are made by the procurement officer.
          </Notice>
        </motion.div>
      )}
    </div>
  );
}

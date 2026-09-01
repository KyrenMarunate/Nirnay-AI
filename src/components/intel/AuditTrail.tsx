import { History } from "lucide-react";
import { cn } from "../../utils/cn";
import type { AuditEntry } from "../../data/intelligenceData";

const stageTone: Record<AuditEntry["stage"], string> = {
  "AI Analysis": "border-[#d8cfc2] bg-[#f7f3ec] text-[#5b4a3a]",
  "Rule Engine": "border-[#cdd9f0] bg-[#eef2fb] text-[#3a5a9c]",
  "Evidence Layer": "border-[#e0d6c5] bg-[#f6f1e8] text-[#7a5510]",
  "Risk Engine": "border-[#f0c9c9] bg-[#f8e9e9] text-[#9c3131]",
  "Human Review": "border-[#f0dcb2] bg-[#fbf1e0] text-[#9c6b1a]",
  Decision: "border-[#c9e2cb] bg-[#eaf3ea] text-[#2f6b3a]",
};

const chainOrder: AuditEntry["stage"][] = [
  "AI Analysis",
  "Rule Engine",
  "Evidence Layer",
  "Risk Engine",
  "Human Review",
  "Decision",
];

/**
 * Decision history — an auditable trail from AI assessment to officer decision.
 */
export function AuditTrail({ entries, title = "Decision History" }: { entries: AuditEntry[]; title?: string }) {
  const reached = new Set(entries.map((e) => e.stage));

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#e5ded1] bg-white p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
          <History size={17} className="text-[#8a5a35]" /> {title}
        </h3>
        <p className="mt-1 text-sm text-[#6b5c4a]">
          Every stage of the evaluation is recorded, from automated assessment to the officer's final decision.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chainOrder.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  reached.has(stage) ? stageTone[stage] : "border-[#e5ded1] bg-white text-[#b3a892]"
                )}
              >
                {stage}
              </span>
              {index < chainOrder.length - 1 && <span className="text-[#c3b9a5]">→</span>}
            </div>
          ))}
        </div>
      </div>

      <ol className="relative space-y-0 rounded-[20px] border border-[#e5ded1] bg-white p-6">
        {entries.map((entry, index) => (
          <li key={`${entry.time}-${entry.title}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-[#8a5a35] bg-[#f7f0e6]" />
              {index < entries.length - 1 && <span className="my-1 w-px flex-1 bg-[#e2d9c9]" style={{ minHeight: 28 }} />}
            </div>
            <div className="pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-[#8a7c68]">{entry.time}</span>
                <span className="text-sm font-medium text-[#3d2b1f]">{entry.title}</span>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]", stageTone[entry.stage])}>
                  {entry.stage}
                </span>
              </div>
              {entry.detail && <p className="mt-1 text-sm text-[#5b4a3a]">{entry.detail}</p>}
              <p className="mt-1 text-xs text-[#a4977f]">
                {entry.actor} · {entry.role}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

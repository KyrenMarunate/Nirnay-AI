import { Braces, Scale, FileSearch, ShieldAlert, UserCheck } from "lucide-react";
import { aiPipeline } from "../../data/intelligenceData";

const icons: Record<string, React.ReactNode> = {
  nlp: <Braces size={15} />,
  rules: <Scale size={15} />,
  evidence: <FileSearch size={15} />,
  risk: <ShieldAlert size={15} />,
  review: <UserCheck size={15} />,
};

/**
 * NirnayAI is a chain of separate stages, not one large chatbot.
 */
export function AIPipelineStrip({ highlight }: { highlight?: string }) {
  return (
    <div className="rounded-[20px] border border-[#e5ded1] bg-white p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">How this result was produced</p>
      <div className="mt-3 flex flex-wrap items-stretch gap-2">
        {aiPipeline.map((stage, index) => (
          <div key={stage.id} className="flex items-stretch gap-2">
            <div
              className={
                "min-w-[168px] rounded-lg border px-3 py-2.5 " +
                (highlight === stage.id ? "border-[#d8c6a4] bg-[#f7f0e6]" : "border-[#e5ded1] bg-[#faf8f4]")
              }
            >
              <p className="flex items-center gap-1.5 text-sm font-medium text-[#3d2b1f]">
                <span className="text-[#8a5a35]">{icons[stage.id]}</span>
                {stage.name}
              </p>
              <p className="mt-0.5 text-xs text-[#8a7c68]">{stage.role}</p>
            </div>
            {index < aiPipeline.length - 1 && (
              <span className="self-center text-[#c3b9a5]" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

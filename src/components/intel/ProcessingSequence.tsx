import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SequenceStep {
  id: string;
  label: string;
  description?: string;
}

export type RunState = "idle" | "running" | "done";

/**
 * Drives a short, professional multi-stage progress sequence for a
 * simulated AI operation. Nothing here fakes a result — it simply paces
 * the stages the platform actually performs.
 */
export function useProcessingRun(stepCount: number, stepMs = 620, initial: RunState = "idle") {
  const [state, setState] = useState<RunState>(initial);
  const [currentStep, setCurrentStep] = useState(initial === "done" ? stepCount : 0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clear, []);

  const start = useCallback(() => {
    clear();
    setState("running");
    setCurrentStep(0);
    for (let i = 1; i <= stepCount; i++) {
      timers.current.push(
        window.setTimeout(() => {
          setCurrentStep(i);
          if (i === stepCount) setState("done");
        }, stepMs * i)
      );
    }
  }, [stepCount, stepMs]);

  const reset = useCallback(() => {
    clear();
    setState("idle");
    setCurrentStep(0);
  }, []);

  const complete = useCallback(() => {
    clear();
    setState("done");
    setCurrentStep(stepCount);
  }, [stepCount]);

  return { state, currentStep, start, reset, complete };
}

export function ProcessingSequence({
  steps,
  currentStep,
  state,
  title,
  compact,
}: {
  steps: SequenceStep[];
  currentStep: number;
  state: RunState;
  title?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-lg border border-[#e5ded1] bg-white", compact ? "p-4" : "p-5")}>
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {state === "done" ? (
            <Check size={16} className="text-[#2f6b3a]" />
          ) : (
            <Loader2 size={16} className="animate-spin text-[#8a5a35]" />
          )}
          <p className="text-sm font-semibold text-[#3d2b1f]">{state === "done" ? "Analysis Complete" : title}</p>
        </div>
      )}
      <ol className="space-y-2.5">
        {steps.map((step, index) => {
          const done = index < currentStep;
          const active = index === currentStep && state === "running";
          return (
            <li key={step.id} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                  done
                    ? "border-[#2f6b3a] bg-[#2f6b3a] text-white"
                    : active
                      ? "border-[#8a5a35] bg-[#f7f0e6] text-[#8a5a35]"
                      : "border-[#dcd3c4] bg-white text-[#b3a892]"
                )}
              >
                {done ? <Check size={11} strokeWidth={3} /> : active ? <Loader2 size={11} className="animate-spin" /> : index + 1}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm transition-colors",
                    done || active ? "font-medium text-[#3d2b1f]" : "text-[#b3a892]"
                  )}
                >
                  {step.label}
                </p>
                {step.description && !compact && (
                  <p className={cn("text-xs", done || active ? "text-[#8a7c68]" : "text-[#c3b9a5]")}>{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <AnimatePresence>
        {state === "done" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-md border border-[#c9e2cb] bg-[#eaf3ea] px-3 py-2 text-xs font-medium text-[#2f6b3a]"
          >
            Analysis complete — results are linked to their source documents.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

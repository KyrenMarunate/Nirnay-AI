/**
 * AI Processing Steps Component
 * Shows the multi-stage analysis pipeline
 */

import { motion } from "framer-motion";
import { CheckCircle, Loader } from "lucide-react";

export interface ProcessingStep {
  id: string;
  label: string;
  description?: string;
}

export interface AIProcessingStepsProps {
  steps: ProcessingStep[];
  currentStep: number;
  isComplete: boolean;
}

export function AIProcessingSteps({ steps, currentStep, isComplete }: AIProcessingStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isDone = idx < currentStep || isComplete;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="relative mt-1 flex-shrink-0">
              <motion.div
                animate={
                  isActive
                    ? { scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }
                    : isDone
                      ? { scale: 1 }
                      : { scale: 1 }
                }
                transition={{ duration: isActive ? 1.2 : 0.3, repeat: isActive ? Infinity : 0 }}
                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  isDone
                    ? "bg-[#8a5a35] text-white"
                    : isActive
                      ? "bg-[#f4d39d] text-[#3d2b1f]"
                      : "bg-[#e7dfd2] text-[#8a7c68]"
                }`}
              >
                {isDone ? (
                  <CheckCircle size={18} />
                ) : isActive ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </motion.div>
            </div>

            <div className="flex-1 pt-0.5">
              <motion.p
                initial={{ opacity: 0.6 }}
                animate={{ opacity: isActive || isDone ? 1 : 0.6 }}
                className="font-medium text-[#3d2b1f]"
              >
                {step.label}
              </motion.p>
              {step.description && (
                <p className="mt-1 text-sm text-[#8a7c68]">{step.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * AI Requirement Mapping Component
 * Shows how documents map to tender requirements
 */

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { RequirementEvidence } from "../../services/aiAnalysisService";

export interface AIRequirementMappingProps {
  requirements: RequirementEvidence[];
}

export function AIRequirementMapping({ requirements }: AIRequirementMappingProps) {
  const statusConfig = {
    compliant: {
      icon: CheckCircle,
      label: "Evidence Found",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    "review-required": {
      icon: AlertCircle,
      label: "Requires Review",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    "non-compliant": {
      icon: XCircle,
      label: "Missing Evidence",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  return (
    <div className="space-y-3">
      {requirements.map((req, idx) => {
        const config = statusConfig[req.status];
        const IconComponent = config.icon;

        return (
          <motion.div
            key={req.requirement}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-2xl border ${config.border} ${config.bg} p-4`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#3d2b1f]">{req.requirement}</h4>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
                  <IconComponent size={14} />
                  <span>{config.label}</span>
                </div>
              </div>

              {req.foundDocuments.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Evidence Submitted</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {req.foundDocuments.map((doc) => (
                      <span
                        key={doc}
                        className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-xs font-medium text-[#3d2b1f]"
                      >
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-2 text-sm text-[#6b5c4a]">{req.reasoning}</p>

              {req.confidence > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xs text-[#8a7c68]">Confidence:</p>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e7dfd2]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${req.confidence}%` }}
                      transition={{ delay: 0.2 + idx * 0.05, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#8a5a35] to-[#d4af85]"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#8a7c68]">{req.confidence}%</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

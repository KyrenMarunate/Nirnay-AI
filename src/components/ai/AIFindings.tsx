/**
 * AI Findings Component
 * Displays detected anomalies, inconsistencies, and compliance issues
 */

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { AIFinding } from "../../services/aiAnalysisService";

export interface AIFindingsProps {
  findings: AIFinding[];
  expandable?: boolean;
}

export function AIFindings({ findings, expandable = true }: AIFindingsProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (findings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-[#d4af85]/40 bg-gradient-to-r from-[#f9f3e8] to-[#fbf9f5] p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8a5a35]/10 text-[#8a5a35]">
            <Info size={16} />
          </div>
          <p className="text-sm font-medium text-[#3d2b1f]">No issues detected</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {findings.map((finding, idx) => {
        const isExpanded = expandable && expandedId === finding.id;
        const severityConfig = {
          low: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: Info,
            color: "text-blue-600",
            label: "Low Priority",
          },
          medium: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: AlertCircle,
            color: "text-amber-600",
            label: "Medium Priority",
          },
          high: {
            bg: "bg-orange-50",
            border: "border-orange-200",
            icon: AlertTriangle,
            color: "text-orange-600",
            label: "High Priority",
          },
          critical: {
            bg: "bg-red-50",
            border: "border-red-200",
            icon: XCircle,
            color: "text-red-600",
            label: "Critical",
          },
        };

        const config = severityConfig[finding.severity];
        const IconComponent = config.icon;

        return (
          <motion.div
            key={finding.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden`}
          >
            <button
              onClick={() => expandable && setExpandedId(isExpanded ? null : finding.id)}
              className="w-full p-4 text-left transition-colors hover:bg-black/2"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 flex-shrink-0 ${config.color}`}>
                  <IconComponent size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-semibold ${config.color}`}>{finding.issue}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#6b5c4a] line-clamp-2">{finding.aiExplanation}</p>
                </div>
                {expandable && (
                  <div className="flex-shrink-0 text-[#8a7c68]">
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      ▼
                    </motion.div>
                  </div>
                )}
              </div>
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-inherit px-4 py-3 space-y-3"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Evidence</p>
                  <ul className="mt-2 space-y-1">
                    {finding.evidence.map((e, i) => (
                      <li key={i} className="text-sm text-[#6b5c4a] flex items-start gap-2">
                        <span className="text-[#d4af85] flex-shrink-0 mt-0.5">•</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">AI Reasoning</p>
                  <p className="mt-2 text-sm text-[#6b5c4a]">{finding.aiExplanation}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Recommended Action</p>
                  <p className="mt-2 text-sm font-medium text-[#3d2b1f]">{finding.recommendedAction}</p>
                </div>

                {finding.affectedDocuments && finding.affectedDocuments.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Affected Documents</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {finding.affectedDocuments.map((doc, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[#3d2b1f]"
                        >
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

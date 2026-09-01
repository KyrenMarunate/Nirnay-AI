/**
 * AI Compliance Score Component
 * Displays overall compliance assessment with breakdown
 */

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { AIComplianceAssessment } from "../../services/aiAnalysisService";

export interface AIComplianceScoreProps {
  assessment: AIComplianceAssessment;
}

export function AIComplianceScore({ assessment }: AIComplianceScoreProps) {
  const statusConfig = {
    compliant: {
      icon: CheckCircle,
      label: "Compliant",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    "review-required": {
      icon: AlertCircle,
      label: "Review Required",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    "non-compliant": {
      icon: XCircle,
      label: "Non-Compliant",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  };

  const config = statusConfig[assessment.overallStatus];
  const IconComponent = config.icon;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl border border-[#d4af85]/30 bg-gradient-to-br from-[#fbf9f5] to-[#f3ebdf] p-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 inline-flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#f0dcc0] via-[#eedbb9] to-[#e9d9bf] shadow-lg"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-[#3d2b1f]">{assessment.overall}%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Compliant</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mx-auto inline-flex items-center gap-2 rounded-full ${config.bg} px-4 py-2`}
          >
            <IconComponent size={18} className={config.color} />
            <span className={`font-semibold ${config.color}`}>{config.label}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm text-[#6b5c4a]"
          >
            {assessment.executiveSummary}
          </motion.p>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Document Consistency",
            value: assessment.documentConsistency,
            icon: "📄",
          },
          {
            label: "Eligibility",
            value: assessment.eligibility,
            icon: "✓",
          },
          {
            label: "Technical Compliance",
            value: assessment.technicalCompliance,
            icon: "⚙",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="rounded-2xl border border-[#e7dfd2] bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-[#8a7c68]">{item.label}</p>
              <span className="text-lg">{item.icon}</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-[#3d2b1f]">{Math.round(item.value)}%</div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1ece2]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-[#8a5a35] to-[#d4af85]"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Findings Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl border border-[#e7dfd2] bg-[#fbf9f5] p-4"
      >
        <h4 className="mb-3 font-semibold text-[#3d2b1f]">Key Findings</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Compliant</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{assessment.keyFindings.compliantCount}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Review Required</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {assessment.keyFindings.reviewRequiredCount}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Failed</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{assessment.keyFindings.failedCount}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

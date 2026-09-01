/**
 * AI Risk Score Component
 * Displays procurement risk assessment
 */

import { motion } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";
import { ProcurementRiskScore } from "../../services/aiAnalysisService";

export interface AIRiskScoreProps {
  risk: ProcurementRiskScore;
}

export function AIRiskScore({ risk }: AIRiskScoreProps): React.ReactElement {
  const riskLevelConfig = {
    low: { color: "text-green-600", bg: "bg-green-50", label: "Low Risk", icon: Shield },
    medium: { color: "text-amber-600", bg: "bg-amber-50", label: "Medium Risk", icon: AlertTriangle },
    high: { color: "text-red-600", bg: "bg-red-50", label: "High Risk", icon: AlertTriangle },
  };

  const config = riskLevelConfig[risk.riskLevel];
  const IconComponent = config.icon;

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative rounded-3xl border ${config.bg} bg-gradient-to-br from-white to-white/50 p-8`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`mx-auto mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full ${config.bg}`}
          >
            <div className={`text-center ${config.color}`}>
              <div className="text-3xl font-bold">{risk.overall}</div>
              <div className="text-xs font-semibold">/ 100</div>
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
            {risk.riskExplanation}
          </motion.p>
        </div>
      </motion.div>

      {/* Risk Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            label: "Document Risk",
            value: risk.documentRisk,
            description: "Consistency of information across documents",
          },
          {
            label: "Eligibility Risk",
            value: risk.eligibilityRisk,
            description: "Compliance with tender requirements",
          },
          {
            label: "Technical Risk",
            value: risk.technicalRisk,
            description: "Technical specification compliance",
          },
          {
            label: "Data Consistency",
            value: risk.dataConsistencyRisk,
            description: "Presence of anomalies and inconsistencies",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="rounded-2xl border border-[#e7dfd2] bg-white p-4"
          >
            <div className="mb-3">
              <p className="text-sm font-medium text-[#3d2b1f]">{item.label}</p>
              <p className="mt-0.5 text-xs text-[#8a7c68]">{item.description}</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-[#3d2b1f]">{item.value}</div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1ece2]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-red-500 to-red-400"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk Interpretation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="rounded-2xl border border-[#e7dfd2] bg-[#fbf9f5] p-4"
      >
        <h4 className="mb-2 font-semibold text-[#3d2b1f]">Understanding Risk Score</h4>
        <div className="space-y-2 text-sm text-[#6b5c4a]">
          <p>
            <strong className="text-[#3d2b1f]">0-20 (Low Risk):</strong> Bidder meets requirements with minimal concerns.
          </p>
          <p>
            <strong className="text-[#3d2b1f]">21-40 (Medium Risk):</strong> Some concerns require review before approval.
          </p>
          <p>
            <strong className="text-[#3d2b1f]">41+ (High Risk):</strong> Significant issues must be addressed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

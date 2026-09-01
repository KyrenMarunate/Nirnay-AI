/**
 * AI Technical Review Component
 * Compares bidder technical proposal against tender requirements
 */

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { TechnicalComplianceItem } from "../../services/aiAnalysisService";

export interface AITechnicalReviewProps {
  items: TechnicalComplianceItem[];
}

export function AITechnicalReview({ items }: AITechnicalReviewProps) {
  const statusConfig = {
    compliant: {
      icon: CheckCircle,
      label: "Compliant",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    "review-required": {
      icon: AlertCircle,
      label: "Review Required",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    "non-compliant": {
      icon: XCircle,
      label: "Non-Compliant",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  const complianceCount = items.filter((i) => i.status === "compliant").length;
  const compliancePercentage = Math.round((complianceCount / items.length) * 100);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af85]/30 bg-gradient-to-r from-[#f9f3e8] to-[#fbf9f5] p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#8a7c68]">Technical Compliance</p>
            <p className="mt-1 text-2xl font-bold text-[#3d2b1f]">
              {complianceCount}/{items.length} Requirements
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#8a5a35]">{compliancePercentage}%</div>
            <p className="text-xs text-[#8a7c68]">Satisfied</p>
          </div>
        </div>
      </motion.div>

      {/* Individual Items */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const config = statusConfig[item.status];
          const IconComponent = config.icon;

          return (
            <motion.div
              key={item.requirementName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl border ${config.border} ${config.bg} p-4`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#3d2b1f]">{item.requirementName}</h4>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.color} flex-shrink-0`}>
                  <IconComponent size={14} />
                  <span>{config.label}</span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-white/50 p-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Required</p>
                  <p className="mt-1 text-sm font-medium text-[#3d2b1f]">{item.requiredValue}</p>
                </div>
                <div className="rounded-lg bg-white/50 p-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7c68]">Bidder Proposal</p>
                  <p className="mt-1 text-sm font-medium text-[#3d2b1f]">{item.bidderValue}</p>
                </div>
              </div>

              <p className="mt-2 text-sm text-[#6b5c4a]">{item.explanation}</p>

              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-[#8a7c68]">Confidence:</p>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e7dfd2]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.confidence}%` }}
                    transition={{ delay: 0.2 + idx * 0.05, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-[#8a5a35] to-[#d4af85]"
                  />
                </div>
                <span className="text-xs font-semibold text-[#8a7c68]">{item.confidence}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

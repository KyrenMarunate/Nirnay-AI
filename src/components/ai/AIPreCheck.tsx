/**
 * AI Pre-Submission Check Component
 * Allows bidders to validate their submission before sending to government
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Zap } from "lucide-react";
import { Button } from "./ui";

export interface PreCheckResult {
  category: string;
  status: "ready" | "warning" | "issue";
  items: {
    label: string;
    status: "pass" | "warning" | "fail";
    description: string;
  }[];
}

export interface AIPreCheckProps {
  results: PreCheckResult[];
  isRunning?: boolean;
  overallReadiness: number;
  onSubmit?: () => void;
}

export function AIPreCheck({ results, isRunning = false, overallReadiness, onSubmit }: AIPreCheckProps) {
  const statusConfig = {
    ready: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    issue: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  };

  const itemStatusConfig = {
    pass: { icon: CheckCircle, label: "Pass", color: "text-green-600" },
    warning: { icon: AlertCircle, label: "Warning", color: "text-amber-600" },
    fail: { icon: XCircle, label: "Failed", color: "text-red-600" },
  };

  return (
    <div className="space-y-6">
      {/* Overall Readiness */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#d4af85]/30 bg-gradient-to-br from-[#fbf9f5] to-[#f3ebdf] p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#3d2b1f]">Bid Readiness</h3>
            <p className="mt-1 text-sm text-[#6b5c4a]">Check before submitting to government</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#8a5a35]">{overallReadiness}%</div>
            <p className="text-xs text-[#8a7c68]">Ready for Submission</p>
          </div>
        </div>
      </motion.div>

      {/* Category Checks */}
      <div className="space-y-3">
        {results.map((result, idx) => {
          const config = statusConfig[result.status];
          const IconComponent = config.icon;

          return (
            <motion.div
              key={result.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl border border-[#e7dfd2] ${config.bg} overflow-hidden`}
            >
              <button className="w-full p-4 text-left transition-colors hover:bg-black/2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent size={18} className={config.color} />
                    <div>
                      <h4 className="font-semibold text-[#3d2b1f]">{result.category}</h4>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {result.items.filter((i) => i.status === "pass").length}/{result.items.length}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {result.items.map((item) => {
                    const itemConfig = itemStatusConfig[item.status];
                    const ItemIcon = itemConfig.icon;

                    return (
                      <div key={item.label} className="flex items-start gap-2 text-sm">
                        <ItemIcon size={14} className={`${itemConfig.color} mt-1 flex-shrink-0`} />
                        <div className="flex-1">
                          <p className="text-[#3d2b1f]">{item.label}</p>
                          <p className="text-xs text-[#8a7c68]">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          disabled={isRunning || overallReadiness < 90}
          onClick={onSubmit}
          className="flex-1"
        >
          {isRunning ? "Checking..." : "Ready to Submit"}
        </Button>
      </div>

      {overallReadiness < 90 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
        >
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Fix Before Submission</p>
              <p className="mt-1 text-sm text-amber-800">
                Resolving the highlighted issues may reduce verification delays.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

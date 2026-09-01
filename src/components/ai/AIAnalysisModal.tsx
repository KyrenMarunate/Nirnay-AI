/**
 * AI Analysis Modal Component
 * Full-screen AI analysis with progressive results display
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader } from "lucide-react";
import { AIAnalysisService, AIComplianceAssessment, ProcurementRiskScore } from "../../services/aiAnalysisService";
import { AIProcessingSteps, ProcessingStep } from "./AIProcessingSteps";
import { AIComplianceScore } from "./AIComplianceScore";
import { AIFindings } from "./AIFindings";
import { AIRequirementMapping } from "./AIRequirementMapping";
import { AITechnicalReview } from "./AITechnicalReview";
import { AIRiskScore } from "./AIRiskScore";
import { Company, Tender } from "../../data/mockData";

export interface AIAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  company: Company;
  tender: Tender;
  onAnalysisComplete?: (assessment: AIComplianceAssessment, risk: ProcurementRiskScore) => void;
}

const processingSteps: ProcessingStep[] = [
  { id: "reading", label: "Reading documents", description: "Loading and initializing document set" },
  { id: "extracting", label: "Extracting information", description: "Parsing entities and data from documents" },
  { id: "identifying", label: "Identifying entities", description: "Extracting company details and certifications" },
  { id: "mapping", label: "Mapping requirements", description: "Matching documents to tender requirements" },
  { id: "cross-checking", label: "Cross-checking information", description: "Verifying consistency across documents" },
  { id: "generating", label: "Generating assessment", description: "Computing compliance scores and findings" },
];

export function AIAnalysisModal({ open, onClose, company, tender, onAnalysisComplete }: AIAnalysisModalProps) {
  const [stage, setStage] = useState<"processing" | "results">("processing");
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState<AIComplianceAssessment | null>(null);
  const [risk, setRisk] = useState<ProcurementRiskScore | null>(null);
  const [selectedTab, setSelectedTab] = useState<"overview" | "findings" | "requirements" | "technical" | "risk">(
    "overview"
  );

  useEffect(() => {
    if (!open) {
      setStage("processing");
      setCurrentStep(0);
      setAssessment(null);
      setRisk(null);
      setSelectedTab("overview");
      return;
    }

    let isMounted = true;

    const runAnalysis = async () => {
      try {
        // Simulate step progression
        for (let i = 0; i < processingSteps.length; i++) {
          if (!isMounted) return;
          setCurrentStep(i);
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        if (!isMounted) return;

        // Run actual analysis
        const comp = await AIAnalysisService.generateComplianceAssessment(company, tender);
        if (!isMounted) return;
        setAssessment(comp);

        await new Promise((resolve) => setTimeout(resolve, 300));

        const riskScore = await AIAnalysisService.calculateProcurementRisk(comp);
        if (!isMounted) return;
        setRisk(riskScore);

        // Transition to results
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (isMounted) {
          setStage("results");
          if (onAnalysisComplete && comp && riskScore) {
            onAnalysisComplete(comp, riskScore);
          }
        }
      } catch (error) {
        console.error("Analysis error:", error);
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [open, company, tender, onAnalysisComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative m-auto max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e7dfd2] bg-[#fbf9f5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e7dfd2] bg-white/90 backdrop-blur-xl px-6 py-4 lg:px-8">
              <div>
                <h2 className="text-xl font-bold text-[#3d2b1f]">AI Compliance Analysis</h2>
                <p className="mt-0.5 text-sm text-[#8a7c68]">{company.name}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-[#f3ebdf] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(92vh-80px)]">
              {stage === "processing" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8 p-6 lg:p-8"
                >
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#3d2b1f]">
                      <Loader size={20} className="animate-spin text-[#8a5a35]" />
                      Analyzing Bid...
                    </h3>
                    <p className="text-sm text-[#6b5c4a] mb-6">
                      Running comprehensive compliance check against tender requirements
                    </p>
                  </div>
                  <AIProcessingSteps
                    steps={processingSteps}
                    currentStep={currentStep}
                    isComplete={false}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 p-6 lg:p-8"
                >
                  {/* Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                      { id: "overview" as const, label: "Overview" },
                      { id: "findings" as const, label: "Findings" },
                      { id: "requirements" as const, label: "Requirements" },
                      { id: "technical" as const, label: "Technical" },
                      { id: "risk" as const, label: "Risk Score" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selectedTab === tab.id
                            ? "bg-[#8a5a35] text-white shadow-sm"
                            : "bg-[#f3ebdf] text-[#3d2b1f] hover:bg-[#eedbb9]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div>
                    {selectedTab === "overview" && assessment && (
                      <AIComplianceScore assessment={assessment} />
                    )}

                    {selectedTab === "findings" && assessment && (
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-[#3d2b1f]">AI Findings</h3>
                        <AIFindings findings={assessment.findings} />
                      </div>
                    )}

                    {selectedTab === "requirements" && assessment && (
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-[#3d2b1f]">Requirement Mapping</h3>
                        <AIRequirementMapping requirements={assessment.requirementMapping} />
                      </div>
                    )}

                    {selectedTab === "technical" && assessment && (
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-[#3d2b1f]">Technical Proposal Review</h3>
                        <AITechnicalReview items={assessment.technicalItems} />
                      </div>
                    )}

                    {selectedTab === "risk" && risk && (
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-[#3d2b1f]">Procurement Risk Assessment</h3>
                        <AIRiskScore risk={risk} />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-[#e7dfd2] pt-6 flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 font-medium text-[#3d2b1f] transition-colors hover:bg-[#f3ebdf]"
                    >
                      Close
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 rounded-2xl bg-[#8a5a35] px-4 py-3 font-medium text-white transition-colors hover:bg-[#6b4427] shadow-sm"
                    >
                      Proceed with Review
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

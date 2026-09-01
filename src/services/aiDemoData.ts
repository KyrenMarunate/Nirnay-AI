/**
 * AI Demo Scenarios
 * Provides predefined mock analysis results for presentation/demo purposes
 */

import { AIComplianceAssessment, ProcurementRiskScore, AIFinding } from "./aiAnalysisService";

/**
 * Scenario A: Strong Bid (Apex Medical Systems)
 * High compliance, well-organized documents, minimal issues
 */
export const demoScenarioStrong: { assessment: AIComplianceAssessment; risk: ProcurementRiskScore } = {
  assessment: {
    overall: 94,
    documentConsistency: 96,
    eligibility: 95,
    technicalCompliance: 91,
    findings: [
      {
        id: "finding-1",
        issue: "EPFO Establishment Code Verification",
        severity: "low",
        evidence: [
          "EPFO_Certificate.pdf: Establishment Code DL/1234567",
          "Company Profile: Matches recorded code",
        ],
        aiExplanation:
          "EPFO establishment code is consistent across documents and matches government records. Compliance is verified.",
        recommendedAction: "No action required. Proceed with evaluation.",
        affectedDocuments: ["EPFO Certificate"],
      },
    ],
    requirementMapping: [
      {
        requirement: "GST Registration",
        expectedDocuments: ["GST_Certificate.pdf"],
        foundDocuments: ["GST_Certificate.pdf"],
        status: "compliant",
        confidence: 98,
        reasoning: "GST registration details identified in the submitted certificate match the company information.",
      },
      {
        requirement: "PAN",
        expectedDocuments: ["PAN_Card.pdf"],
        foundDocuments: ["PAN_Card.pdf"],
        status: "compliant",
        confidence: 99,
        reasoning: "PAN certificate submitted and verified.",
      },
      {
        requirement: "Income Tax Compliance",
        expectedDocuments: ["Income_Tax_2025.pdf"],
        foundDocuments: ["Income_Tax_2025.pdf"],
        status: "compliant",
        confidence: 95,
        reasoning: "Latest income tax documents submitted and verified.",
      },
      {
        requirement: "Udyam / MSME",
        expectedDocuments: ["Udyam_Certificate.pdf"],
        foundDocuments: ["Udyam_Certificate.pdf"],
        status: "compliant",
        confidence: 96,
        reasoning: "Udyam certificate submitted with matching details.",
      },
      {
        requirement: "EPFO",
        expectedDocuments: ["EPFO_Certificate.pdf"],
        foundDocuments: ["EPFO_Certificate.pdf"],
        status: "compliant",
        confidence: 93,
        reasoning: "EPFO compliance verified. Establishment code matches records.",
      },
      {
        requirement: "ESIC",
        expectedDocuments: ["ESIC_Certificate.pdf"],
        foundDocuments: ["ESIC_Certificate.pdf"],
        status: "compliant",
        confidence: 94,
        reasoning: "ESIC compliance verified.",
      },
      {
        requirement: "Make in India / Local Content",
        expectedDocuments: ["Technical_Proposal.pdf"],
        foundDocuments: ["Technical_Proposal.pdf"],
        status: "compliant",
        confidence: 90,
        reasoning: "Technical proposal demonstrates 78% local content sourcing, satisfying tender requirement.",
      },
    ],
    technicalItems: [
      {
        requirementName: "Multi-parameter Monitoring",
        requiredValue: "SpO2/ECG/NIBP sensors required",
        bidderValue: "SpO2/ECG/NIBP/Temp sensors provided",
        status: "compliant",
        confidence: 96,
        explanation: "Bidder proposal exceeds requirement by including temperature monitoring.",
      },
      {
        requirementName: "Display Specification",
        requiredValue: "Minimum 10-inch display",
        bidderValue: "15-inch multi-parameter display",
        status: "compliant",
        confidence: 98,
        explanation: "Display size significantly exceeds minimum requirement.",
      },
      {
        requirementName: "Connectivity",
        requiredValue: "WiFi connectivity mandatory",
        bidderValue: "WiFi + Bluetooth connectivity",
        status: "compliant",
        confidence: 97,
        explanation: "Bidder provides dual connectivity exceeding specification.",
      },
      {
        requirementName: "Warranty",
        requiredValue: "3 years minimum",
        bidderValue: "3 years standard, 5 years extended available",
        status: "compliant",
        confidence: 99,
        explanation: "Warranty meets and exceeds requirement.",
      },
      {
        requirementName: "Certification",
        requiredValue: "CE and ISO 13485 mandatory",
        bidderValue: "CE, ISO 13485, and ISO 9001 certified",
        status: "compliant",
        confidence: 98,
        explanation: "All required certifications provided with additional quality certification.",
      },
      {
        requirementName: "Delivery Timeline",
        requiredValue: "90 days maximum",
        bidderValue: "90 days",
        status: "compliant",
        confidence: 95,
        explanation: "Delivery timeline matches requirement exactly.",
      },
    ],
    overallStatus: "compliant",
    executiveSummary:
      "Apex Medical Systems satisfies all 7 evaluated compliance requirements. Submitted company documents show complete consistency across all certificates. The technical proposal meets and exceeds all specified equipment requirements. Delivery timeline is within limit. Overall compliance score: 94%.",
    keyFindings: {
      compliantCount: 7,
      reviewRequiredCount: 0,
      failedCount: 0,
    },
  },
  risk: {
    overall: 12,
    documentRisk: 4,
    eligibilityRisk: 5,
    technicalRisk: 9,
    dataConsistencyRisk: 0,
    riskExplanation:
      "Risk is minimal. Bidder demonstrates strong compliance across all dimensions with consistent documentation and specifications that exceed requirements.",
    riskLevel: "low",
  },
};

/**
 * Scenario B: Problematic Bid (Nova Meditech)
 * Multiple compliance gaps, document inconsistencies, technical concerns
 */
export const demoScenarioProblematic: { assessment: AIComplianceAssessment; risk: ProcurementRiskScore } = {
  assessment: {
    overall: 68,
    documentConsistency: 58,
    eligibility: 72,
    technicalCompliance: 62,
    findings: [
      {
        id: "finding-1",
        issue: "Company Name Mismatch",
        severity: "high",
        evidence: [
          "Company Profile: Nova Meditech Pvt. Ltd.",
          "PAN Certificate: Nova Meditech Private Limited (Name variation)",
          "Udyam: Nova Meditech",
        ],
        aiExplanation:
          "The legal entity name differs between documents. GST and PAN use different name formats. Manual verification is required to confirm identity.",
        recommendedAction: "Request clarification on official company name. Verify with ROC.",
        affectedDocuments: ["PAN Certificate", "Company Registration", "GST Certificate"],
      },
      {
        id: "finding-2",
        issue: "EPFO Establishment Code Mismatch",
        severity: "critical",
        evidence: [
          "EPFO Certificate: Establishment ID KA/9876543",
          "Government Records: Expected matching ID not found",
        ],
        aiExplanation:
          "Establishment ID in submitted EPFO certificate could not be matched with government records. This suggests either document forgery or registration discrepancy.",
        recommendedAction:
          "Reject or escalate to manual verification. Contact EPFO directly to verify establishment credentials.",
        affectedDocuments: ["EPFO Certificate"],
      },
      {
        id: "finding-3",
        issue: "Missing Latest Income Tax Assessment",
        severity: "medium",
        evidence: [
          "Submitted Document: Income_Tax_2024.pdf (year 2024)",
          "Tender Requirement: Current year assessment (2025)",
        ],
        aiExplanation:
          "Bidder submitted previous year income tax document. Latest available assessment for the current fiscal year is missing.",
        recommendedAction: "Request bidder to submit current year income tax return or latest available assessment.",
        affectedDocuments: ["Income Tax Documents"],
      },
      {
        id: "finding-4",
        issue: "ESIC Registration Number Formatting",
        severity: "medium",
        evidence: [
          "ESIC Certificate: Format differs from standard ESIC number structure",
          "Expected Format: XX-XXXXXX-XXXX-XXXX",
        ],
        aiExplanation:
          "ESIC registration number formatting does not match standard government format. Requires verification.",
        recommendedAction: "Request confirmation of ESIC registration number. Verify with ESIC database.",
        affectedDocuments: ["ESIC Certificate"],
      },
      {
        id: "finding-5",
        issue: "Technical Specification Gap",
        severity: "high",
        evidence: [
          "Tender Requirement: Multi-parameter monitoring (SpO2/ECG/NIBP minimum)",
          "Bidder Proposal: Only SpO2 and ECG sensors",
        ],
        aiExplanation:
          "Bidder's technical proposal does not include NIBP (Non-Invasive Blood Pressure) monitoring, which is a mandatory specification.",
        recommendedAction: "Reject bid as non-compliant, or request bidder to confirm capability addition.",
        affectedDocuments: ["Technical Proposal"],
      },
    ],
    requirementMapping: [
      {
        requirement: "GST Registration",
        expectedDocuments: ["GST_Certificate.pdf"],
        foundDocuments: ["GST_Certificate.pdf"],
        status: "compliant",
        confidence: 85,
        reasoning: "GST certificate submitted but name format differs from other documents.",
      },
      {
        requirement: "PAN",
        expectedDocuments: ["PAN_Card.pdf"],
        foundDocuments: ["PAN_Card.pdf"],
        status: "review-required",
        confidence: 62,
        reasoning: "PAN certificate submitted with name variation. Manual verification required.",
      },
      {
        requirement: "Income Tax Compliance",
        expectedDocuments: ["Income_Tax_2025.pdf"],
        foundDocuments: ["Income_Tax_2024.pdf"],
        status: "review-required",
        confidence: 58,
        reasoning: "Submitted income tax document is from previous year. Current year assessment missing.",
      },
      {
        requirement: "Udyam / MSME",
        expectedDocuments: ["Udyam_Certificate.pdf"],
        foundDocuments: ["Udyam_Certificate.pdf"],
        status: "compliant",
        confidence: 90,
        reasoning: "Udyam certificate submitted and verified.",
      },
      {
        requirement: "EPFO",
        expectedDocuments: ["EPFO_Certificate.pdf"],
        foundDocuments: ["EPFO_Certificate.pdf"],
        status: "non-compliant",
        confidence: 40,
        reasoning: "EPFO establishment code could not be verified against government records.",
      },
      {
        requirement: "ESIC",
        expectedDocuments: ["ESIC_Certificate.pdf"],
        foundDocuments: ["ESIC_Certificate.pdf"],
        status: "review-required",
        confidence: 65,
        reasoning: "ESIC registration number format requires verification.",
      },
      {
        requirement: "Make in India / Local Content",
        expectedDocuments: ["Technical_Proposal.pdf"],
        foundDocuments: ["Technical_Proposal.pdf"],
        status: "review-required",
        confidence: 55,
        reasoning: "Local content claims in technical proposal require substantiation with documentation.",
      },
    ],
    technicalItems: [
      {
        requirementName: "Multi-parameter Monitoring",
        requiredValue: "SpO2/ECG/NIBP sensors required",
        bidderValue: "SpO2 and ECG sensors only",
        status: "non-compliant",
        confidence: 95,
        explanation: "NIBP (Blood Pressure) monitoring is mandatory but not included in proposal.",
      },
      {
        requirementName: "Display Specification",
        requiredValue: "Minimum 10-inch display",
        bidderValue: "12-inch display",
        status: "compliant",
        confidence: 97,
        explanation: "Display meets minimum requirement.",
      },
      {
        requirementName: "Connectivity",
        requiredValue: "WiFi connectivity mandatory",
        bidderValue: "WiFi connectivity only (no Bluetooth)",
        status: "compliant",
        confidence: 92,
        explanation: "WiFi connectivity provided as required.",
      },
      {
        requirementName: "Warranty",
        requiredValue: "3 years minimum",
        bidderValue: "2 years standard warranty",
        status: "non-compliant",
        confidence: 98,
        explanation: "Warranty period falls short of 3-year minimum requirement.",
      },
      {
        requirementName: "Certification",
        requiredValue: "CE and ISO 13485 mandatory",
        bidderValue: "CE certified, ISO 13485 pending",
        status: "review-required",
        confidence: 72,
        explanation: "CE certification provided but ISO 13485 certification status is unclear.",
      },
      {
        requirementName: "Delivery Timeline",
        requiredValue: "90 days maximum",
        bidderValue: "120 days",
        status: "non-compliant",
        confidence: 96,
        explanation: "Delivery timeline exceeds maximum allowed period by 30 days.",
      },
    ],
    overallStatus: "non-compliant",
    executiveSummary:
      "Nova Meditech Pvt. Ltd. has significant compliance gaps. Critical issue: EPFO establishment code verification failed. Company name inconsistencies detected across documents. Technical proposal fails on 2 key requirements (NIBP monitoring and warranty period). Delivery timeline exceeds tender limit. Overall compliance score: 68%. Not recommended for approval without substantial document clarifications and technical proposal revisions.",
    keyFindings: {
      compliantCount: 2,
      reviewRequiredCount: 4,
      failedCount: 1,
    },
  },
  risk: {
    overall: 72,
    documentRisk: 42,
    eligibilityRisk: 28,
    technicalRisk: 38,
    dataConsistencyRisk: 60,
    riskExplanation:
      "Risk is elevated due to multiple compliance gaps and document inconsistencies. The failed EPFO verification is a critical concern suggesting potential document authenticity issues or misrepresentation. Technical proposal contains specification failures.",
    riskLevel: "high",
  },
};

export const allDemoScenarios = {
  "apex-medical": demoScenarioStrong,
  "nova-meditech": demoScenarioProblematic,
};

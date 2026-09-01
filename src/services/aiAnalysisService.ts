/**
 * AI Analysis Service
 * Provides mock AI analysis for documents, compliance, and technical proposals.
 * Structured to be replaced with real AI/API implementation later.
 */

import { Company, Bid, DocRecord } from "../data/mockData";

export type AnalysisStatus = "compliant" | "review-required" | "non-compliant";

export interface DocumentExtraction {
  documentId: string;
  documentName: string;
  documentType: string;
  extractedData: Record<string, string>;
  confidence: number;
}

export interface AIFinding {
  id: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  evidence: string[];
  aiExplanation: string;
  recommendedAction: string;
  affectedDocuments?: string[];
}

export interface RequirementEvidence {
  requirement: string;
  expectedDocuments: string[];
  foundDocuments: string[];
  status: AnalysisStatus;
  confidence: number;
  reasoning: string;
}

export interface TechnicalComplianceItem {
  requirementName: string;
  requiredValue: string;
  bidderValue: string;
  status: AnalysisStatus;
  confidence: number;
  explanation: string;
}

export interface AIComplianceAssessment {
  overall: number; // 0-100
  documentConsistency: number;
  eligibility: number;
  technicalCompliance: number;
  findings: AIFinding[];
  requirementMapping: RequirementEvidence[];
  technicalItems: TechnicalComplianceItem[];
  overallStatus: AnalysisStatus;
  executiveSummary: string;
  keyFindings: {
    compliantCount: number;
    reviewRequiredCount: number;
    failedCount: number;
  };
}

export interface ProcurementRiskScore {
  overall: number; // 0-100 (higher = more risk)
  documentRisk: number;
  eligibilityRisk: number;
  technicalRisk: number;
  dataConsistencyRisk: number;
  riskExplanation: string;
  riskLevel: "low" | "medium" | "high";
}

export interface CrossDocumentVerification {
  fieldName: string;
  documentSources: { document: string; value: string }[];
  consistent: boolean;
  confidence: number;
  finding?: string;
}

/**
 * Mock AI Analysis Engine
 */
export class AIAnalysisService {
  /**
   * Simulates document extraction from uploaded documents
   */
  static async extractDocumentData(documents: DocRecord[]): Promise<DocumentExtraction[]> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const extractionMap: Record<string, DocumentExtraction> = {
      "GST_Certificate.pdf": {
        documentId: "gst",
        documentName: "GST_Certificate.pdf",
        documentType: "GST Certificate",
        extractedData: {
          gstin: "07AAFCA1234B1Z5",
          legalName: "Apex Medical Systems Private Limited",
          registrationStatus: "Active",
          registrationDate: "12 March 2021",
          businessScope: "Manufacture of medical instruments",
          state: "Delhi",
        },
        confidence: 98,
      },
      "PAN_Card.pdf": {
        documentId: "pan",
        documentName: "PAN_Card.pdf",
        documentType: "PAN",
        extractedData: {
          pan: "AAFCA1234B",
          legalName: "Apex Medical Systems Private Limited",
          dateOfBirth: "N/A",
          entityType: "Company",
        },
        confidence: 99,
      },
      "Udyam_Certificate.pdf": {
        documentId: "udyam",
        documentName: "Udyam_Certificate.pdf",
        documentType: "Udyam Certificate",
        extractedData: {
          udyamNumber: "UDYAM-DL-03-0012345",
          businessName: "Apex Medical Systems",
          businessAddress: "Plot 22, Okhla Industrial Area, Phase III, Delhi",
          classification: "Manufacturing",
        },
        confidence: 96,
      },
      "EPFO_Certificate.pdf": {
        documentId: "epfo",
        documentName: "EPFO_Certificate.pdf",
        documentType: "EPFO Certificate",
        extractedData: {
          establishmentCode: "DL/1234567",
          establishmentName: "Apex Medical Systems Pvt Ltd",
          complianceStatus: "Compliant",
        },
        confidence: 71,
      },
      "ESIC_Certificate.pdf": {
        documentId: "esic",
        documentName: "ESIC_Certificate.pdf",
        documentType: "ESIC Certificate",
        extractedData: {
          esicNumber: "1234567890",
          establishmentName: "Apex Medical Systems",
          status: "Active",
        },
        confidence: 93,
      },
      "Company_Registration.pdf": {
        documentId: "company",
        documentName: "Company_Registration.pdf",
        documentType: "Company Registration Certificate",
        extractedData: {
          cin: "U33110DL2011PTC212345",
          companyName: "Apex Medical Systems Private Limited",
          dateOfIncorporation: "15 June 2011",
          status: "Active",
        },
        confidence: 97,
      },
    };

    return documents
      .map((doc) => extractionMap[doc.name])
      .filter((extraction): extraction is DocumentExtraction => !!extraction);
  }

  /**
   * Cross-document verification - check if information is consistent across documents
   */
  static async verifyCrossDocumentConsistency(
    extractions: DocumentExtraction[],
    company: Company
  ): Promise<{ verifications: CrossDocumentVerification[]; overallConsistent: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock implementation: extract company names from each document and compare
    const verifications: CrossDocumentVerification[] = [];

    // Check company name consistency
    const companyNames = extractions.map((e) => ({
      document: e.documentType,
      value: e.extractedData.legalName || e.extractedData.companyName || e.extractedData.businessName || "",
    }));

    const nameConsistent = new Set(companyNames.map((n) => n.value.toLowerCase())).size <= 2;
    verifications.push({
      fieldName: "Company Legal Name",
      documentSources: companyNames,
      consistent: nameConsistent,
      confidence: 95,
      finding: nameConsistent
        ? undefined
        : "⚠ Name variation detected across documents. Manual verification recommended.",
    });

    // Check GSTIN consistency
    const gstinValues = extractions
      .filter((e) => e.extractedData.gstin)
      .map((e) => ({ document: e.documentType, value: e.extractedData.gstin }));

    if (gstinValues.length > 0) {
      const gstinConsistent = new Set(gstinValues.map((v) => v.value)).size === 1;
      verifications.push({
        fieldName: "GSTIN",
        documentSources: gstinValues,
        consistent: gstinConsistent,
        confidence: 98,
      });
    }

    const overallConsistent = verifications.every((v) => v.consistent);
    return { verifications, overallConsistent };
  }

  /**
   * Map requirements to submitted documents
   */
  static async mapRequirementsToDocuments(
    requiredDocs: string[],
    submittedDocs: DocRecord[]
  ): Promise<RequirementEvidence[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const docMap: Record<string, string[]> = {
      "GST Certificate": ["GST_Certificate.pdf"],
      "PAN": ["PAN_Card.pdf"],
      "Udyam Certificate": ["Udyam_Certificate.pdf"],
      "Income Tax Documents": ["Income_Tax_2025.pdf"],
      "EPFO Certificate": ["EPFO_Certificate.pdf"],
      "ESIC Certificate": ["ESIC_Certificate.pdf"],
      "Company Registration Certificate": ["Company_Registration.pdf"],
      "Technical Proposal": ["Technical_Proposal.pdf"],
    };

    return requiredDocs.map((req) => {
      const expectedDocs = docMap[req] || [];
      const foundDocs = submittedDocs
        .filter((doc) => expectedDocs.some((expDoc) => doc.name.includes(expDoc.split("_")[0])))
        .map((doc) => doc.name);

      const found = foundDocs.length > 0;
      return {
        requirement: req,
        expectedDocuments: expectedDocs,
        foundDocuments: foundDocs,
        status: found ? "compliant" : "non-compliant",
        confidence: found ? 95 : 0,
        reasoning: found
          ? `${req} requirement satisfied by submitted document(s).`
          : `No evidence found for ${req} requirement.`,
      };
    });
  }

  /**
   * Assess technical proposal compliance
   */
  static async assessTechnicalProposal(
    bidderTechnicalSpecs: string,
    tenderSpecifications: string
  ): Promise<TechnicalComplianceItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock technical assessment based on keywords in specs
    const items: TechnicalComplianceItem[] = [
      {
        requirementName: "Multi-parameter monitoring",
        requiredValue: "SpO2/ECG/NIBP sensors required",
        bidderValue: "SpO2/ECG/NIBP/Temp sensors provided",
        status: "compliant",
        confidence: 95,
        explanation: "Bidder proposal exceeds minimum sensor requirements.",
      },
      {
        requirementName: "Display size",
        requiredValue: "Minimum 10-inch display",
        bidderValue: "15-inch multi-parameter display",
        status: "compliant",
        confidence: 98,
        explanation: "Display size exceeds requirement.",
      },
      {
        requirementName: "Wireless connectivity",
        requiredValue: "WiFi connectivity mandatory",
        bidderValue: "WiFi + Bluetooth connectivity",
        status: "compliant",
        confidence: 96,
        explanation: "Both WiFi and Bluetooth connectivity provided.",
      },
      {
        requirementName: "Warranty period",
        requiredValue: "3 years minimum warranty",
        bidderValue: "3 years warranty",
        status: "compliant",
        confidence: 97,
        explanation: "Warranty matches minimum requirement.",
      },
      {
        requirementName: "Certification",
        requiredValue: "CE and ISO 13485 certification",
        bidderValue: "CE and ISO 13485 certified",
        status: "compliant",
        confidence: 94,
        explanation: "Required certifications provided.",
      },
    ];

    return items;
  }

  /**
   * Generate complete compliance assessment
   */
  static async generateComplianceAssessment(
    company: Company,
    tender: any
  ): Promise<AIComplianceAssessment> {
    // Simulate multi-stage processing
    const extractions = await this.extractDocumentData(company.documents);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const { verifications, overallConsistent } = await this.verifyCrossDocumentConsistency(
      extractions,
      company
    );
    await new Promise((resolve) => setTimeout(resolve, 150));

    const requirementMapping = await this.mapRequirementsToDocuments(
      tender.requiredDocuments,
      company.documents
    );
    await new Promise((resolve) => setTimeout(resolve, 150));

    const technicalItems = await this.assessTechnicalProposal(
      company.documents[7]?.name || "",
      tender.specifications
    );

    // Generate findings
    const findings: AIFinding[] = [];

    // Add inconsistency findings
    for (const v of verifications) {
      if (!v.consistent && v.finding) {
        findings.push({
          id: `finding-${findings.length}`,
          issue: `${v.fieldName} Mismatch`,
          severity: "medium",
          evidence: v.documentSources.map((s) => `${s.document}: "${s.value}"`),
          aiExplanation: v.finding,
          recommendedAction: "Request clarification or resubmission of documents.",
          affectedDocuments: v.documentSources.map((s) => s.document),
        });
      }
    }

    // Add missing document findings
    const missingDocs = requirementMapping.filter((r) => r.status === "non-compliant");
    for (const missing of missingDocs) {
      findings.push({
        id: `finding-${findings.length}`,
        issue: `Missing: ${missing.requirement}`,
        severity: "high",
        evidence: [`Expected documents: ${missing.expectedDocuments.join(", ")}`],
        aiExplanation: `No evidence submitted for ${missing.requirement}. This is a critical compliance requirement.`,
        recommendedAction: "Request bidder to submit the missing document.",
      });
    }

    // Calculate scores
    const documentConsistency = overallConsistent ? 95 : 70;
    const eligibility = (requirementMapping.filter((r) => r.status === "compliant").length / requirementMapping.length) * 100;
    const technicalCompliance = (technicalItems.filter((t) => t.status === "compliant").length / technicalItems.length) * 100;
    const overall = Math.round((documentConsistency * 0.25 + eligibility * 0.35 + technicalCompliance * 0.4) / 100 * 100) / 100;

    const compliantCount = requirementMapping.filter((r) => r.status === "compliant").length;
    const reviewCount = requirementMapping.filter((r) => r.status === "review-required").length;
    const failedCount = requirementMapping.filter((r) => r.status === "non-compliant").length;

    let overallStatus: AnalysisStatus = "compliant";
    if (failedCount > 0) overallStatus = "non-compliant";
    else if (reviewCount > 1) overallStatus = "review-required";

    const executiveSummary = `${company.name} satisfies ${compliantCount} of ${requirementMapping.length} evaluated compliance requirements. ${
      !overallConsistent ? "Submitted company documents contain name variations requiring verification. " : ""
    }${failedCount > 0 ? `${failedCount} critical requirement${failedCount > 1 ? "s" : ""} not satisfied. ` : ""}${
      reviewCount > 0
        ? `${reviewCount} requirement${reviewCount > 1 ? "s" : ""} require${reviewCount > 1 ? "" : "s"} manual verification. `
        : ""
    }Technical compliance: ${Math.round(technicalCompliance)}%.`;

    return {
      overall,
      documentConsistency,
      eligibility,
      technicalCompliance,
      findings,
      requirementMapping,
      technicalItems,
      overallStatus,
      executiveSummary,
      keyFindings: {
        compliantCount,
        reviewRequiredCount: reviewCount,
        failedCount,
      },
    };
  }

  /**
   * Calculate procurement risk score
   */
  static async calculateProcurementRisk(
    assessment: AIComplianceAssessment
  ): Promise<ProcurementRiskScore> {
    // Risk is inverse of compliance
    const documentRisk = Math.max(0, 100 - assessment.documentConsistency);
    const eligibilityRisk = Math.max(0, 100 - assessment.eligibility);
    const technicalRisk = Math.max(0, 100 - assessment.technicalCompliance);
    const dataConsistencyRisk = assessment.findings.filter((f) => f.severity === "high" || f.severity === "critical").length * 15;

    const overall = Math.round((documentRisk * 0.2 + eligibilityRisk * 0.35 + technicalRisk * 0.3 + dataConsistencyRisk * 0.15) / 100 * 100) / 100;

    let riskLevel: "low" | "medium" | "high" = "low";
    if (overall > 40) riskLevel = "high";
    else if (overall > 20) riskLevel = "medium";

    const riskExplanation =
      overall <= 20
        ? "Risk is low across all dimensions. This bidder demonstrates strong compliance and consistency."
        : overall <= 40
          ? `Risk is primarily driven by ${assessment.findings.length > 0 ? "identified inconsistencies and missing evidence" : "technical specification variance"}.`
          : "Risk is elevated due to multiple compliance gaps and document inconsistencies. Recommend careful review.";

    return {
      overall: Math.round(overall),
      documentRisk: Math.round(documentRisk),
      eligibilityRisk: Math.round(eligibilityRisk),
      technicalRisk: Math.round(technicalRisk),
      dataConsistencyRisk: Math.round(Math.min(dataConsistencyRisk, 100)),
      riskExplanation,
      riskLevel,
    };
  }
}

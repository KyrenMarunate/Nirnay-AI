/**
 * NirnayAI — Procurement Intelligence Demo Data
 *
 * This file models the core USP chain of the platform:
 *
 *   Messy documents -> AI/NLP understanding -> Structured requirements
 *   -> Deterministic rule evaluation -> Evidence (document + page)
 *   -> Risk prioritisation -> Human review -> Audit trail
 *
 * Everything here is simulated demo data for the prototype. No live
 * government API is contacted anywhere in this file.
 */

// ---------------------------------------------------------------- types

export type RequirementStatus = "compliant" | "needs-review" | "non-compliant" | "missing";

export type RequirementType =
  | "Technical"
  | "Financial"
  | "Eligibility"
  | "Certification"
  | "Delivery"
  | "Legal";

/** Which stage of the pipeline produced a result. */
export type DecisionEngine = "Rule Engine" | "AI/NLP" | "Evidence Layer" | "Human Review";

export type RiskLevel = "low" | "medium" | "high";

export interface Requirement {
  id: string;
  name: string;
  type: RequirementType;
  /** Human readable rule, e.g. "≥ 3 years" */
  rule: string;
  /** Deterministic expression evaluated by the rule engine */
  expression: string;
  mandatory: boolean;
  /** Original tender language the requirement was extracted from */
  tenderText: string;
  /** Where the clause was found in the tender document */
  clauseRef: string;
  extractionConfidence: number;
}

export interface Evidence {
  document: string;
  page: number;
  /** Verbatim line located in the source document */
  snippet: string;
  extractedValue: string;
  confidence: number;
}

export interface RequirementResult {
  requirementId: string;
  status: RequirementStatus;
  /** Value the rule engine compared against the tender rule */
  bidderValue: string;
  evidence: Evidence | null;
  /** Populated when two documents disagree about the same field */
  conflictingEvidence?: Evidence[];
  explanation: string;
  decidedBy: DecisionEngine;
  humanReview: "Not Required" | "Required" | "Completed";
  /** Reason the case could not be closed deterministically */
  ambiguity?: string;
  reviewConfidence?: number;
  risk?: RiskLevel;
}

export interface DocumentCheck {
  label: string;
  fileName?: string;
  status: "present" | "attention" | "missing";
  mandatory: boolean;
  note?: string;
}

export interface ConsistencyField {
  field: string;
  rows: { document: string; value: string; page: number }[];
  consistent: boolean;
}

export interface ConsistencyFinding {
  id: string;
  title: string;
  kind: "variation" | "conflict";
  detail: string;
  risk: RiskLevel;
  recommendation: string;
  sources: { document: string; page: number; value: string }[];
}

export interface RiskOverview {
  level: RiskLevel;
  criticalExceptions: number;
  missingEvidence: number;
  conflictingEvidence: number;
  technicalConcerns: number;
  reviewRequired: number;
  highestPriority: {
    title: string;
    detail: string;
    risk: RiskLevel;
    bidderId?: string;
    requirementId?: string;
  };
}

export interface AuditEntry {
  time: string;
  stage: "AI Analysis" | "Rule Engine" | "Evidence Layer" | "Risk Engine" | "Human Review" | "Decision";
  title: string;
  detail?: string;
  actor: string;
  role: string;
}

export interface BidderIntelligence {
  bidderId: string;
  bidderName: string;
  tenderId: string;
  /** Secondary metric only — never used to hide a mandatory failure */
  overallScore: number;
  analysedAt: string;
  results: RequirementResult[];
  documents: DocumentCheck[];
  consistency: ConsistencyField[];
  findings: ConsistencyFinding[];
  risk: RiskOverview;
  audit: AuditEntry[];
}

// ------------------------------------------------- tender requirements

/**
 * Requirements extracted by the AI/NLP layer from the tender document of
 * GEM/2026/B/458921 (Medical Equipment incl. central monitoring workstation).
 */
export const tenderRequirements: Record<string, Requirement[]> = {
  "GEM/2026/B/458921": [
    {
      id: "req-ram",
      name: "Workstation RAM",
      type: "Technical",
      rule: "≥ 16 GB",
      expression: "RAM >= 16 GB",
      mandatory: true,
      tenderText:
        "The central monitoring workstation shall be supplied with not less than 16 GB of system memory (RAM).",
      clauseRef: "Tender Document — Clause 4.2, Page 12",
      extractionConfidence: 97,
    },
    {
      id: "req-ssd",
      name: "SSD Storage",
      type: "Technical",
      rule: "≥ 512 GB",
      expression: "SSD >= 512 GB",
      mandatory: true,
      tenderText: "Solid state storage of minimum 512 GB shall be provided per workstation.",
      clauseRef: "Tender Document — Clause 4.2, Page 12",
      extractionConfidence: 96,
    },
    {
      id: "req-processor",
      name: "Processor",
      type: "Technical",
      rule: "i7 or equivalent",
      expression: "Processor >= Intel i7 (or documented equivalent)",
      mandatory: true,
      tenderText:
        "Workstation shall be powered by an Intel Core i7 processor or equivalent performance class.",
      clauseRef: "Tender Document — Clause 4.3, Page 12",
      extractionConfidence: 88,
    },
    {
      id: "req-display",
      name: "Display Size",
      type: "Technical",
      rule: "≥ 10 inch",
      expression: "Display >= 10 in",
      mandatory: true,
      tenderText: "Bedside monitor display shall not be smaller than 10 inches (diagonal).",
      clauseRef: "Tender Document — Clause 4.4, Page 13",
      extractionConfidence: 98,
    },
    {
      id: "req-sensors",
      name: "Multi-parameter Sensors",
      type: "Technical",
      rule: "SpO2 + ECG + NIBP",
      expression: "Sensors ⊇ { SpO2, ECG, NIBP }",
      mandatory: true,
      tenderText:
        "Each monitoring unit must support SpO2, ECG and NIBP (non-invasive blood pressure) measurement as a minimum.",
      clauseRef: "Tender Document — Clause 4.5, Page 13",
      extractionConfidence: 95,
    },
    {
      id: "req-warranty",
      name: "Warranty Period",
      type: "Technical",
      rule: "≥ 3 years",
      expression: "Warranty >= 3 years",
      mandatory: true,
      tenderText:
        "A comprehensive on-site warranty of minimum three (3) years from date of commissioning is mandatory.",
      clauseRef: "Tender Document — Clause 5.1, Page 15",
      extractionConfidence: 99,
    },
    {
      id: "req-turnover",
      name: "Annual Turnover",
      type: "Financial",
      rule: "≥ ₹10 Cr",
      expression: "Turnover >= 10,00,00,000 INR",
      mandatory: true,
      tenderText:
        "The bidder shall have an average annual turnover of at least ₹10 Crore in the last three financial years.",
      clauseRef: "Tender Document — Clause 6.2, Page 18",
      extractionConfidence: 94,
    },
    {
      id: "req-experience",
      name: "Bidder Experience",
      type: "Eligibility",
      rule: "≥ 5 years",
      expression: "Experience >= 5 years",
      mandatory: true,
      tenderText:
        "Bidders must demonstrate a minimum of five (5) years of experience in supply of medical monitoring equipment.",
      clauseRef: "Tender Document — Clause 6.3, Page 18",
      extractionConfidence: 93,
    },
    {
      id: "req-gst",
      name: "GST Registration",
      type: "Eligibility",
      rule: "Active",
      expression: "GST.status == Active",
      mandatory: true,
      tenderText: "A valid and active GST registration is required for participation.",
      clauseRef: "Tender Document — Clause 6.1, Page 17",
      extractionConfidence: 99,
    },
    {
      id: "req-epfo",
      name: "EPFO Compliance",
      type: "Eligibility",
      rule: "Valid establishment code",
      expression: "EPFO.establishmentCode == valid",
      mandatory: true,
      tenderText: "Bidder shall submit evidence of EPFO compliance with a valid establishment code.",
      clauseRef: "Tender Document — Clause 6.4, Page 18",
      extractionConfidence: 91,
    },
    {
      id: "req-iso9001",
      name: "ISO 9001",
      type: "Certification",
      rule: "Required",
      expression: "Certifications ∋ ISO 9001",
      mandatory: true,
      tenderText: "A valid ISO 9001 quality management certificate must be enclosed with the bid.",
      clauseRef: "Tender Document — Clause 7.1, Page 20",
      extractionConfidence: 97,
    },
    {
      id: "req-iso13485",
      name: "ISO 13485",
      type: "Certification",
      rule: "Required",
      expression: "Certifications ∋ ISO 13485",
      mandatory: true,
      tenderText: "Medical device quality certification ISO 13485 is mandatory for the offered product.",
      clauseRef: "Tender Document — Clause 7.2, Page 20",
      extractionConfidence: 96,
    },
    {
      id: "req-oem",
      name: "OEM Authorization",
      type: "Certification",
      rule: "Required",
      expression: "Documents ∋ OEM Authorization Letter",
      mandatory: true,
      tenderText:
        "Where the bidder is not the manufacturer, an OEM authorization letter in the prescribed format shall be submitted.",
      clauseRef: "Tender Document — Clause 7.3, Page 20",
      extractionConfidence: 95,
    },
    {
      id: "req-delivery",
      name: "Delivery Period",
      type: "Delivery",
      rule: "≤ 90 days",
      expression: "Delivery <= 90 days",
      mandatory: true,
      tenderText: "Complete supply, installation and commissioning shall be finished within 90 days of award.",
      clauseRef: "Tender Document — Clause 8.1, Page 22",
      extractionConfidence: 98,
    },
  ],
};

export function getRequirements(tenderId?: string): Requirement[] {
  if (!tenderId) return [];
  return tenderRequirements[tenderId] ?? [];
}

export function getRequirement(tenderId: string | undefined, requirementId: string): Requirement | undefined {
  return getRequirements(tenderId).find((r) => r.id === requirementId);
}

// ------------------------------------------------ bidder intelligence

const apex: BidderIntelligence = {
  bidderId: "apex-medical",
  bidderName: "Apex Medical Systems Pvt. Ltd.",
  tenderId: "GEM/2026/B/458921",
  overallScore: 94,
  analysedAt: "27 August 2026, 14:32",
  results: [
    {
      requirementId: "req-ram",
      status: "compliant",
      bidderValue: "16 GB",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 4,
        snippet: "Central station workstation: Intel Core i7-1265U, 16 GB DDR5 RAM, 512 GB NVMe SSD.",
        extractedValue: "16 GB",
        confidence: 96,
      },
      explanation: "Extracted memory value satisfies the deterministic rule RAM >= 16 GB.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-ssd",
      status: "compliant",
      bidderValue: "512 GB",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 4,
        snippet: "Storage: 512 GB NVMe solid state drive (upgradeable to 1 TB).",
        extractedValue: "512 GB",
        confidence: 97,
      },
      explanation: "Offered storage equals the mandatory minimum of 512 GB.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-processor",
      status: "compliant",
      bidderValue: "Intel Core i7-1265U",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 5,
        snippet: "Processor: Intel Core i7-1265U (12th generation, 10 cores).",
        extractedValue: "Intel Core i7",
        confidence: 95,
      },
      explanation: "Offered processor is an exact match for the tender's i7 class requirement.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-display",
      status: "compliant",
      bidderValue: "15 inch",
      evidence: {
        document: "Product_Specification.pdf",
        page: 3,
        snippet: "15-inch multi-parameter TFT display with capacitive touch.",
        extractedValue: "15 inch",
        confidence: 98,
      },
      explanation: "Display size exceeds the mandatory minimum of 10 inches.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-sensors",
      status: "compliant",
      bidderValue: "SpO2, ECG, NIBP, Temp",
      evidence: {
        document: "Product_Specification.pdf",
        page: 4,
        snippet: "Parameters supported: SpO2, ECG (3/5 lead), NIBP, Temperature.",
        extractedValue: "SpO2 + ECG + NIBP + Temp",
        confidence: 96,
      },
      explanation: "All three mandatory parameters are present; temperature is offered additionally.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-warranty",
      status: "compliant",
      bidderValue: "3 years",
      evidence: {
        document: "Product_Specification.pdf",
        page: 7,
        snippet: "Warranty period: 3 years comprehensive on-site (extendable to 5 years).",
        extractedValue: "3 years",
        confidence: 98,
      },
      explanation: "Warranty satisfies the mandatory minimum of 3 years.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-turnover",
      status: "compliant",
      bidderValue: "₹42.6 Cr",
      evidence: {
        document: "Audited_Financials_FY25.pdf",
        page: 3,
        snippet: "Average annual turnover (FY23–FY25): ₹42,61,00,000.",
        extractedValue: "₹42.61 Cr",
        confidence: 94,
      },
      explanation: "Average turnover comfortably exceeds the ₹10 Cr threshold.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-experience",
      status: "compliant",
      bidderValue: "14 years",
      evidence: {
        document: "Company_Registration.pdf",
        page: 1,
        snippet: "Date of incorporation: 15 June 2011.",
        extractedValue: "14 years",
        confidence: 93,
      },
      explanation: "Derived operating experience of 14 years exceeds the 5 year minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-gst",
      status: "compliant",
      bidderValue: "Active — 07AAFCA1234B1Z5",
      evidence: {
        document: "GST_Certificate.pdf",
        page: 1,
        snippet: "GSTIN 07AAFCA1234B1Z5 — Status: Active. Registered: 12 March 2021.",
        extractedValue: "Active",
        confidence: 98,
      },
      explanation: "GSTIN located and status field reads Active in the submitted certificate.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-epfo",
      status: "needs-review",
      bidderValue: "DL/1234567 (partial match)",
      evidence: {
        document: "EPFO_Certificate.pdf",
        page: 1,
        snippet: "Establishment code: DL/1234567 — Apex Medical Systems Pvt Ltd.",
        extractedValue: "DL/1234567",
        confidence: 71,
      },
      explanation:
        "Establishment code was read with reduced confidence and only partially matches the code recorded in the company profile.",
      ambiguity: "Character-level extraction confidence below the deterministic acceptance threshold.",
      reviewConfidence: 71,
      decidedBy: "AI/NLP",
      humanReview: "Required",
      risk: "medium",
    },
    {
      requirementId: "req-iso9001",
      status: "compliant",
      bidderValue: "ISO 9001:2015 — valid to Mar 2028",
      evidence: {
        document: "ISO_9001_Certificate.pdf",
        page: 1,
        snippet: "ISO 9001:2015 certificate. Valid until 31 March 2028.",
        extractedValue: "ISO 9001:2015",
        confidence: 97,
      },
      explanation: "Valid ISO 9001 certificate located with expiry beyond the contract period.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-iso13485",
      status: "compliant",
      bidderValue: "ISO 13485:2016 — valid to Aug 2027",
      evidence: {
        document: "ISO_13485_Certificate.pdf",
        page: 1,
        snippet: "ISO 13485:2016 medical devices QMS certificate. Valid until 20 August 2027.",
        extractedValue: "ISO 13485:2016",
        confidence: 96,
      },
      explanation: "Medical device quality certification is present and unexpired.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-oem",
      status: "compliant",
      bidderValue: "OEM authorization letter submitted",
      evidence: {
        document: "OEM_Authorization_Letter.pdf",
        page: 1,
        snippet: "We authorise Apex Medical Systems to quote and supply against tender GEM/2026/B/458921.",
        extractedValue: "Authorization present",
        confidence: 90,
      },
      explanation:
        "Authorization letter located. Note: the organisation name on this letter is a shortened form — see Consistency Check.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
      risk: "medium",
    },
    {
      requirementId: "req-delivery",
      status: "compliant",
      bidderValue: "90 days",
      evidence: {
        document: "Bid_Form.pdf",
        page: 2,
        snippet: "Committed delivery, installation and commissioning: 90 days from award.",
        extractedValue: "90 days",
        confidence: 95,
      },
      explanation: "Committed delivery meets the maximum permitted period of 90 days.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
  ],
  documents: [
    { label: "GST Certificate", fileName: "GST_Certificate.pdf", status: "present", mandatory: true },
    { label: "PAN", fileName: "PAN_Card.pdf", status: "present", mandatory: true },
    { label: "Udyam Certificate", fileName: "Udyam_Certificate.pdf", status: "present", mandatory: true },
    { label: "Income Tax Documents", fileName: "Income_Tax_2025.pdf", status: "present", mandatory: true },
    {
      label: "EPFO Compliance Evidence",
      fileName: "EPFO_Certificate.pdf",
      status: "attention",
      mandatory: true,
      note: "Establishment code read with 71% confidence — officer verification recommended.",
    },
    { label: "ESIC Certificate", fileName: "ESIC_Certificate.pdf", status: "present", mandatory: true },
    { label: "Technical Proposal", fileName: "Technical_Proposal.pdf", status: "present", mandatory: true },
    { label: "Product Specification", fileName: "Product_Specification.pdf", status: "present", mandatory: true },
    { label: "OEM Authorization", fileName: "OEM_Authorization_Letter.pdf", status: "present", mandatory: true },
  ],
  consistency: [
    {
      field: "Company Name",
      consistent: false,
      rows: [
        { document: "GST Certificate", value: "Apex Medical Systems Pvt Ltd", page: 1 },
        { document: "PAN", value: "Apex Medical Systems Pvt Ltd", page: 1 },
        { document: "Udyam Certificate", value: "Apex Medical Systems Pvt Ltd", page: 1 },
        { document: "OEM Authorization", value: "Apex Medical Systems", page: 1 },
      ],
    },
    {
      field: "GSTIN",
      consistent: true,
      rows: [
        { document: "GST Certificate", value: "07AAFCA1234B1Z5", page: 1 },
        { document: "Bid Form", value: "07AAFCA1234B1Z5", page: 1 },
      ],
    },
    {
      field: "PAN",
      consistent: true,
      rows: [
        { document: "PAN", value: "AAFCA1234B", page: 1 },
        { document: "Income Tax Documents", value: "AAFCA1234B", page: 1 },
      ],
    },
    {
      field: "Warranty",
      consistent: true,
      rows: [
        { document: "Product Specification", value: "3 years", page: 7 },
        { document: "Bid Form", value: "3 years", page: 3 },
      ],
    },
  ],
  findings: [
    {
      id: "apex-name-variation",
      title: "Potential Identity Variation",
      kind: "variation",
      detail: "OEM Authorization uses a shortened organization name.",
      risk: "medium",
      recommendation: "Verify legal entity mapping before award.",
      sources: [
        { document: "GST Certificate", page: 1, value: "Apex Medical Systems Pvt Ltd" },
        { document: "OEM Authorization", page: 1, value: "Apex Medical Systems" },
      ],
    },
  ],
  risk: {
    level: "low",
    criticalExceptions: 0,
    missingEvidence: 0,
    conflictingEvidence: 1,
    technicalConcerns: 0,
    reviewRequired: 1,
    highestPriority: {
      title: "Identity Variation — OEM Authorization",
      detail: "Organisation name on the OEM letter is a shortened form of the registered legal name.",
      risk: "medium",
      bidderId: "apex-medical",
      requirementId: "req-oem",
    },
  },
  audit: [
    { time: "14:28", stage: "AI Analysis", title: "Document set ingested", detail: "9 documents, 41 pages indexed.", actor: "NirnayAI Engine", role: "AI/NLP Layer" },
    { time: "14:32", stage: "AI Analysis", title: "AI assessment completed", detail: "14 requirements evaluated against extracted evidence.", actor: "NirnayAI Engine", role: "AI/NLP Layer" },
    { time: "14:33", stage: "Rule Engine", title: "13 requirements satisfied deterministically", actor: "NirnayAI Rule Engine", role: "Deterministic Evaluation" },
    { time: "14:34", stage: "Evidence Layer", title: "Evidence linked for every evaluated requirement", detail: "Each result mapped to document and page.", actor: "NirnayAI Engine", role: "Evidence Layer" },
    { time: "14:35", stage: "Risk Engine", title: "1 medium risk flagged", detail: "Identity variation on OEM Authorization.", actor: "NirnayAI Risk Engine", role: "Risk Prioritisation" },
    { time: "14:38", stage: "Human Review", title: "Officer opened EPFO evidence", actor: "Ananya Sharma", role: "Procurement Officer (Demo)" },
    { time: "14:40", stage: "Human Review", title: "EPFO requirement retained in review queue", detail: "Awaiting establishment code confirmation.", actor: "Ananya Sharma", role: "Procurement Officer (Demo)" },
  ],
};

const bharat: BidderIntelligence = {
  bidderId: "bharat-healthcare",
  bidderName: "Bharat Healthcare Solutions",
  tenderId: "GEM/2026/B/458921",
  overallScore: 87,
  analysedAt: "28 August 2026, 14:32",
  results: [
    {
      requirementId: "req-ram",
      status: "compliant",
      bidderValue: "16 GB",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 3,
        snippet: "Nursing station workstation supplied with 16 GB RAM and 512 GB SSD.",
        extractedValue: "16 GB",
        confidence: 94,
      },
      explanation: "Memory satisfies RAM >= 16 GB.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-ssd",
      status: "compliant",
      bidderValue: "512 GB",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 3,
        snippet: "Storage configuration: 512 GB SATA SSD.",
        extractedValue: "512 GB",
        confidence: 93,
      },
      explanation: "Storage equals the mandatory minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-processor",
      status: "compliant",
      bidderValue: "Intel Core i7-1255U",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 3,
        snippet: "Processor: Intel Core i7-1255U.",
        extractedValue: "Intel Core i7",
        confidence: 95,
      },
      explanation: "Processor class matches the tender requirement exactly.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-display",
      status: "compliant",
      bidderValue: "12 inch",
      evidence: {
        document: "Product_Specification.pdf",
        page: 2,
        snippet: "12-inch colour TFT display, 1280 x 800.",
        extractedValue: "12 inch",
        confidence: 97,
      },
      explanation: "Display exceeds the 10 inch minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-sensors",
      status: "compliant",
      bidderValue: "SpO2, ECG, NIBP",
      evidence: {
        document: "Product_Specification.pdf",
        page: 3,
        snippet: "Supported parameters: SpO2, ECG, NIBP.",
        extractedValue: "SpO2 + ECG + NIBP",
        confidence: 95,
      },
      explanation: "All three mandatory parameters present.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-warranty",
      status: "non-compliant",
      bidderValue: "2 years",
      evidence: {
        document: "Product_Specification.pdf",
        page: 7,
        snippet: "Warranty period: 2 years",
        extractedValue: "2 years",
        confidence: 97,
      },
      explanation: "Bidder warranty is below the tender's mandatory minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
      risk: "high",
    },
    {
      requirementId: "req-turnover",
      status: "needs-review",
      bidderValue: "₹9.8 Cr (FY24) / ₹11.2 Cr (FY25)",
      evidence: {
        document: "Audited_Financials_FY25.pdf",
        page: 2,
        snippet: "Turnover FY24: ₹9,80,00,000 · FY25: ₹11,20,00,000 · FY23: ₹9,10,00,000.",
        extractedValue: "3-year average ₹10.03 Cr",
        confidence: 68,
      },
      explanation:
        "The three-year average marginally clears ₹10 Cr, but two of three individual years fall below the threshold.",
      ambiguity: "Tender language does not state whether the threshold applies per year or as an average.",
      reviewConfidence: 68,
      decidedBy: "AI/NLP",
      humanReview: "Required",
      risk: "medium",
    },
    {
      requirementId: "req-experience",
      status: "compliant",
      bidderValue: "18 years",
      evidence: {
        document: "Company_Registration.pdf",
        page: 1,
        snippet: "Registered on 04 February 2008 as a Limited Liability Partnership.",
        extractedValue: "18 years",
        confidence: 92,
      },
      explanation: "Operating experience exceeds the 5 year minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-gst",
      status: "compliant",
      bidderValue: "Active — 27AABFB5678C1ZR",
      evidence: {
        document: "GST_Certificate.pdf",
        page: 1,
        snippet: "GSTIN 27AABFB5678C1ZR — Status: Active.",
        extractedValue: "Active",
        confidence: 96,
      },
      explanation: "Active GST registration located.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-epfo",
      status: "needs-review",
      bidderValue: "MH/4455667 (format mismatch)",
      evidence: {
        document: "EPFO_Certificate.pdf",
        page: 1,
        snippet: "Establishment code MH-4455667 — Bharat Healthcare Solutions LLP.",
        extractedValue: "MH-4455667",
        confidence: 74,
      },
      explanation:
        "Establishment code uses a non-standard separator, so the deterministic format check could not be completed.",
      ambiguity: "Code format differs from the expected XX/9999999 pattern.",
      reviewConfidence: 74,
      decidedBy: "AI/NLP",
      humanReview: "Required",
      risk: "medium",
    },
    {
      requirementId: "req-iso9001",
      status: "compliant",
      bidderValue: "ISO 9001:2015 — valid to Nov 2027",
      evidence: {
        document: "ISO_9001_Certificate.pdf",
        page: 1,
        snippet: "ISO 9001:2015 certificate valid until 14 November 2027.",
        extractedValue: "ISO 9001:2015",
        confidence: 95,
      },
      explanation: "Valid quality certification located.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-iso13485",
      status: "compliant",
      bidderValue: "ISO 13485:2016 — valid to Jun 2027",
      evidence: {
        document: "ISO_13485_Certificate.pdf",
        page: 1,
        snippet: "ISO 13485:2016 certificate valid until 30 June 2027.",
        extractedValue: "ISO 13485:2016",
        confidence: 94,
      },
      explanation: "Medical device certification present and unexpired.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-oem",
      status: "missing",
      bidderValue: "No evidence submitted",
      evidence: null,
      explanation:
        "No OEM authorization letter was located in the submitted document set. This is a mandatory document.",
      decidedBy: "Evidence Layer",
      humanReview: "Required",
      risk: "high",
    },
    {
      requirementId: "req-delivery",
      status: "non-compliant",
      bidderValue: "100 days",
      evidence: {
        document: "Bid_Form.pdf",
        page: 2,
        snippet: "Delivery and commissioning schedule: 100 days from date of award.",
        extractedValue: "100 days",
        confidence: 96,
      },
      explanation: "Committed delivery exceeds the maximum permitted period by 10 days.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
      risk: "medium",
    },
  ],
  documents: [
    { label: "GST Certificate", fileName: "GST_Certificate.pdf", status: "present", mandatory: true },
    { label: "PAN", fileName: "PAN_Card.pdf", status: "present", mandatory: true },
    { label: "Udyam Certificate", fileName: "Udyam_Certificate.pdf", status: "present", mandatory: true },
    { label: "Income Tax Documents", fileName: "Income_Tax_2025.pdf", status: "present", mandatory: true },
    {
      label: "EPFO Compliance Evidence",
      fileName: "EPFO_Certificate.pdf",
      status: "attention",
      mandatory: true,
      note: "Establishment code format differs from the expected pattern.",
    },
    { label: "ESIC Certificate", fileName: "ESIC_Certificate.pdf", status: "present", mandatory: true },
    { label: "Technical Proposal", fileName: "Technical_Proposal.pdf", status: "present", mandatory: true },
    { label: "Product Specification", fileName: "Product_Specification.pdf", status: "present", mandatory: true },
    { label: "OEM Authorization", status: "missing", mandatory: true, note: "Mandatory under Clause 7.3 — not submitted." },
  ],
  consistency: [
    {
      field: "Company Name",
      consistent: true,
      rows: [
        { document: "GST Certificate", value: "Bharat Healthcare Solutions LLP", page: 1 },
        { document: "PAN", value: "Bharat Healthcare Solutions LLP", page: 1 },
        { document: "Bid Form", value: "Bharat Healthcare Solutions LLP", page: 1 },
      ],
    },
    {
      field: "GSTIN",
      consistent: true,
      rows: [
        { document: "GST Certificate", value: "27AABFB5678C1ZR", page: 1 },
        { document: "Bid Form", value: "27AABFB5678C1ZR", page: 1 },
      ],
    },
    {
      field: "Warranty",
      consistent: false,
      rows: [
        { document: "Product Specification", value: "2 years", page: 7 },
        { document: "Bid Form", value: "2 years + optional extension", page: 3 },
        { document: "Technical Proposal", value: "3 years (marketing claim)", page: 6 },
      ],
    },
    {
      field: "Delivery Period",
      consistent: true,
      rows: [
        { document: "Bid Form", value: "100 days", page: 2 },
        { document: "Technical Proposal", value: "100 days", page: 8 },
      ],
    },
  ],
  findings: [
    {
      id: "bharat-warranty-conflict",
      title: "Conflicting Warranty Statements",
      kind: "conflict",
      detail:
        "Technical Proposal markets a 3 year warranty while the Product Specification and Bid Form both state 2 years.",
      risk: "high",
      recommendation:
        "Treat the binding commercial document as authoritative and seek written clarification before evaluation.",
      sources: [
        { document: "Product Specification", page: 7, value: "2 years" },
        { document: "Technical Proposal", page: 6, value: "3 years" },
      ],
    },
  ],
  risk: {
    level: "high",
    criticalExceptions: 2,
    missingEvidence: 1,
    conflictingEvidence: 1,
    technicalConcerns: 1,
    reviewRequired: 2,
    highestPriority: {
      title: "Warranty Conflict",
      detail: "Mandatory requirement not satisfied — offered warranty is 2 years against a 3 year minimum.",
      risk: "high",
      bidderId: "bharat-healthcare",
      requirementId: "req-warranty",
    },
  },
  audit: [
    { time: "14:32", stage: "AI Analysis", title: "AI assessment completed", detail: "14 requirements evaluated from 8 submitted documents.", actor: "NirnayAI Engine", role: "AI/NLP Layer" },
    { time: "14:34", stage: "Rule Engine", title: "Warranty requirement flagged", detail: "Rule Warranty >= 3 years evaluated false (bidder value 2 years).", actor: "NirnayAI Rule Engine", role: "Deterministic Evaluation" },
    { time: "14:35", stage: "Evidence Layer", title: "Evidence identified", detail: "Product_Specification.pdf — Page 7: \u201cWarranty period: 2 years\u201d.", actor: "NirnayAI Engine", role: "Evidence Layer" },
    { time: "14:36", stage: "Risk Engine", title: "Risk flagged as High", detail: "Mandatory technical exception plus one missing mandatory document.", actor: "NirnayAI Risk Engine", role: "Risk Prioritisation" },
    { time: "14:37", stage: "Human Review", title: "Officer reviewed evidence", detail: "Warranty evidence and conflicting technical proposal claim examined.", actor: "Ananya Sharma", role: "Procurement Officer (Demo)" },
    { time: "14:39", stage: "Human Review", title: "Officer marked requirement Non-Compliant", detail: "Binding specification document treated as authoritative.", actor: "Ananya Sharma", role: "Procurement Officer (Demo)" },
    { time: "14:41", stage: "Decision", title: "Final decision submitted", detail: "Bid retained for committee consideration with recorded exception.", actor: "Rajesh Iyer", role: "Reviewing Authority (Demo)" },
  ],
};

const nova: BidderIntelligence = {
  bidderId: "nova-meditech",
  bidderName: "Nova Meditech Pvt. Ltd.",
  tenderId: "GEM/2026/B/458921",
  overallScore: 78,
  analysedAt: "29 August 2026, 14:32",
  results: [
    {
      requirementId: "req-ram",
      status: "needs-review",
      bidderValue: "16 GB / 8 GB (conflict)",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 4,
        snippet: "Workstation memory: 16 GB DDR4.",
        extractedValue: "16 GB",
        confidence: 92,
      },
      conflictingEvidence: [
        {
          document: "Technical_Proposal.pdf",
          page: 4,
          snippet: "Workstation memory: 16 GB DDR4.",
          extractedValue: "16 GB",
          confidence: 92,
        },
        {
          document: "Product_Brochure.pdf",
          page: 2,
          snippet: "NovaVital central station — standard configuration 8 GB RAM.",
          extractedValue: "8 GB",
          confidence: 90,
        },
      ],
      explanation: "Two submitted sources provide different RAM specifications.",
      ambiguity: "Conflicting evidence prevents a deterministic comparison against RAM >= 16 GB.",
      reviewConfidence: 51,
      decidedBy: "Evidence Layer",
      humanReview: "Required",
      risk: "high",
    },
    {
      requirementId: "req-ssd",
      status: "compliant",
      bidderValue: "512 GB",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 4,
        snippet: "Storage: 512 GB SSD.",
        extractedValue: "512 GB",
        confidence: 93,
      },
      explanation: "Storage meets the mandatory minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-processor",
      status: "needs-review",
      bidderValue: "AMD Ryzen 7 5800U",
      evidence: {
        document: "Technical_Proposal.pdf",
        page: 5,
        snippet: "Processor: AMD Ryzen 7 5800U (8 cores / 16 threads).",
        extractedValue: "Ryzen 7",
        confidence: 94,
      },
      explanation: "Semantic equivalence could not be established with sufficient confidence.",
      ambiguity:
        "Tender permits \u201ci7 or equivalent\u201d. Equivalence between Ryzen 7 5800U and the i7 class is a technical judgement reserved for the evaluating officer.",
      reviewConfidence: 63,
      decidedBy: "AI/NLP",
      humanReview: "Required",
      risk: "medium",
    },
    {
      requirementId: "req-display",
      status: "compliant",
      bidderValue: "10 inch",
      evidence: {
        document: "Product_Specification.pdf",
        page: 2,
        snippet: "10-inch LCD display with touch interface.",
        extractedValue: "10 inch",
        confidence: 95,
      },
      explanation: "Display exactly meets the minimum permitted size.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-sensors",
      status: "non-compliant",
      bidderValue: "SpO2, ECG",
      evidence: {
        document: "Product_Specification.pdf",
        page: 3,
        snippet: "Supported parameters: SpO2, ECG. NIBP module available as optional add-on.",
        extractedValue: "SpO2 + ECG",
        confidence: 93,
      },
      explanation: "NIBP monitoring is mandatory but is offered only as an optional add-on.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
      risk: "high",
    },
    {
      requirementId: "req-warranty",
      status: "compliant",
      bidderValue: "3 years",
      evidence: {
        document: "Product_Specification.pdf",
        page: 6,
        snippet: "Warranty: 3 years comprehensive.",
        extractedValue: "3 years",
        confidence: 94,
      },
      explanation: "Warranty satisfies the mandatory minimum of 3 years.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-turnover",
      status: "compliant",
      bidderValue: "₹12.4 Cr",
      evidence: {
        document: "Audited_Financials_FY25.pdf",
        page: 2,
        snippet: "Average annual turnover (FY23–FY25): ₹12,40,00,000.",
        extractedValue: "₹12.4 Cr",
        confidence: 90,
      },
      explanation: "Average turnover clears the ₹10 Cr threshold.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-experience",
      status: "compliant",
      bidderValue: "10 years",
      evidence: {
        document: "Company_Registration.pdf",
        page: 1,
        snippet: "Date of incorporation: 08 January 2016.",
        extractedValue: "10 years",
        confidence: 91,
      },
      explanation: "Operating experience exceeds the 5 year minimum.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-gst",
      status: "compliant",
      bidderValue: "Active — 29AAGCN4321D1Z8",
      evidence: {
        document: "GST_Certificate.pdf",
        page: 1,
        snippet: "GSTIN 29AAGCN4321D1Z8 — Status: Active.",
        extractedValue: "Active",
        confidence: 92,
      },
      explanation: "Active GST registration located.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-epfo",
      status: "non-compliant",
      bidderValue: "KA/9876543 — not matched",
      evidence: {
        document: "EPFO_Certificate.pdf",
        page: 1,
        snippet: "Establishment ID KA/9876543 — Nova Meditech.",
        extractedValue: "KA/9876543",
        confidence: 40,
      },
      explanation:
        "The establishment identifier on the certificate does not correspond to the establishment named in the bidder profile.",
      decidedBy: "Rule Engine",
      humanReview: "Required",
      risk: "high",
    },
    {
      requirementId: "req-iso9001",
      status: "missing",
      bidderValue: "No evidence submitted",
      evidence: null,
      explanation: "No ISO 9001 certificate was located in the submitted document set.",
      decidedBy: "Evidence Layer",
      humanReview: "Required",
      risk: "high",
    },
    {
      requirementId: "req-iso13485",
      status: "compliant",
      bidderValue: "ISO 13485:2016 — valid to Feb 2027",
      evidence: {
        document: "ISO_13485_Certificate.pdf",
        page: 1,
        snippet: "ISO 13485:2016 certificate valid until 11 February 2027.",
        extractedValue: "ISO 13485:2016",
        confidence: 89,
      },
      explanation: "Medical device certification present and unexpired.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
    },
    {
      requirementId: "req-oem",
      status: "needs-review",
      bidderValue: "Letter issued to \u201cNova Meditech\u201d",
      evidence: {
        document: "OEM_Authorization_Letter.pdf",
        page: 1,
        snippet: "This is to authorise Nova Meditech for the supply of NovaVital monitoring units.",
        extractedValue: "Nova Meditech",
        confidence: 77,
      },
      explanation:
        "Authorization letter is present but names a shortened organisation that does not exactly match the registered legal entity.",
      ambiguity: "Legal entity mapping between \u201cNova Meditech\u201d and \u201cNova Meditech Private Limited\u201d is unconfirmed.",
      reviewConfidence: 66,
      decidedBy: "AI/NLP",
      humanReview: "Required",
      risk: "medium",
    },
    {
      requirementId: "req-delivery",
      status: "non-compliant",
      bidderValue: "110 days",
      evidence: {
        document: "Bid_Form.pdf",
        page: 2,
        snippet: "Delivery capacity: 110 days from award.",
        extractedValue: "110 days",
        confidence: 95,
      },
      explanation: "Committed delivery exceeds the maximum permitted period by 20 days.",
      decidedBy: "Rule Engine",
      humanReview: "Not Required",
      risk: "medium",
    },
  ],
  documents: [
    { label: "GST Certificate", fileName: "GST_Certificate.pdf", status: "present", mandatory: true },
    {
      label: "PAN",
      fileName: "PAN_Card.pdf",
      status: "attention",
      mandatory: true,
      note: "Name on PAN does not fully match the registered legal name.",
    },
    { label: "Udyam Certificate", fileName: "Udyam_Certificate.pdf", status: "present", mandatory: true },
    {
      label: "Income Tax Documents",
      fileName: "Income_Tax_2024.pdf",
      status: "attention",
      mandatory: true,
      note: "Submitted assessment year is 2024; current year assessment not located.",
    },
    {
      label: "EPFO Compliance Evidence",
      fileName: "EPFO_Certificate.pdf",
      status: "attention",
      mandatory: true,
      note: "Establishment identifier could not be matched to the bidder profile.",
    },
    { label: "ESIC Certificate", fileName: "ESIC_Certificate.pdf", status: "present", mandatory: true },
    { label: "Technical Proposal", fileName: "Technical_Proposal.pdf", status: "present", mandatory: true },
    { label: "Product Specification", fileName: "Product_Specification.pdf", status: "present", mandatory: true },
    { label: "ISO 9001 Certificate", status: "missing", mandatory: true, note: "Mandatory under Clause 7.1 — not submitted." },
  ],
  consistency: [
    {
      field: "Company Name",
      consistent: false,
      rows: [
        { document: "GST Certificate", value: "Nova Meditech Private Limited", page: 1 },
        { document: "PAN", value: "Nova Meditech Pvt Ltd", page: 1 },
        { document: "OEM Authorization", value: "Nova Meditech", page: 1 },
      ],
    },
    {
      field: "Workstation RAM",
      consistent: false,
      rows: [
        { document: "Technical Proposal", value: "16 GB", page: 4 },
        { document: "Product Brochure", value: "8 GB", page: 2 },
      ],
    },
    {
      field: "GSTIN",
      consistent: true,
      rows: [
        { document: "GST Certificate", value: "29AAGCN4321D1Z8", page: 1 },
        { document: "Bid Form", value: "29AAGCN4321D1Z8", page: 1 },
      ],
    },
    {
      field: "Delivery Period",
      consistent: true,
      rows: [
        { document: "Bid Form", value: "110 days", page: 2 },
        { document: "Technical Proposal", value: "110 days", page: 9 },
      ],
    },
  ],
  findings: [
    {
      id: "nova-ram-conflict",
      title: "Conflicting Evidence",
      kind: "conflict",
      detail: "Two submitted sources provide different RAM specifications.",
      risk: "high",
      recommendation:
        "Request written confirmation of the offered configuration before the requirement can be evaluated.",
      sources: [
        { document: "Technical Proposal", page: 4, value: "16 GB" },
        { document: "Product Brochure", page: 2, value: "8 GB" },
      ],
    },
    {
      id: "nova-name-variation",
      title: "Potential Identity Variation",
      kind: "variation",
      detail: "OEM Authorization uses a shortened organization name.",
      risk: "medium",
      recommendation: "Verify legal entity mapping.",
      sources: [
        { document: "GST Certificate", page: 1, value: "Nova Meditech Private Limited" },
        { document: "OEM Authorization", page: 1, value: "Nova Meditech" },
      ],
    },
  ],
  risk: {
    level: "high",
    criticalExceptions: 3,
    missingEvidence: 1,
    conflictingEvidence: 2,
    technicalConcerns: 2,
    reviewRequired: 3,
    highestPriority: {
      title: "Conflicting RAM Evidence",
      detail: "Mandatory technical requirement cannot be evaluated while two documents disagree.",
      risk: "high",
      bidderId: "nova-meditech",
      requirementId: "req-ram",
    },
  },
  audit: [
    { time: "14:32", stage: "AI Analysis", title: "AI assessment completed", detail: "14 requirements evaluated from 8 submitted documents.", actor: "NirnayAI Engine", role: "AI/NLP Layer" },
    { time: "14:33", stage: "Rule Engine", title: "3 mandatory requirements evaluated false", detail: "Sensors, EPFO compliance and delivery period.", actor: "NirnayAI Rule Engine", role: "Deterministic Evaluation" },
    { time: "14:34", stage: "Evidence Layer", title: "Conflicting evidence detected", detail: "Technical_Proposal.pdf p.4 (16 GB) vs Product_Brochure.pdf p.2 (8 GB).", actor: "NirnayAI Engine", role: "Evidence Layer" },
    { time: "14:35", stage: "Risk Engine", title: "Risk flagged as High", detail: "3 critical exceptions, 1 missing mandatory certificate, 2 conflicts.", actor: "NirnayAI Risk Engine", role: "Risk Prioritisation" },
    { time: "14:36", stage: "Human Review", title: "3 cases routed to review queue", detail: "RAM conflict, processor equivalence, OEM entity mapping.", actor: "NirnayAI Engine", role: "Routing" },
    { time: "14:44", stage: "Human Review", title: "Officer reviewed conflicting RAM evidence", actor: "Ananya Sharma", role: "Procurement Officer (Demo)" },
  ],
};

export const bidderIntelligence: BidderIntelligence[] = [apex, bharat, nova];

export function getIntelligence(tenderId?: string, bidderId?: string): BidderIntelligence | undefined {
  return bidderIntelligence.find(
    (b) => (!tenderId || b.tenderId === tenderId) && (!bidderId || b.bidderId === bidderId)
  );
}

export function getTenderIntelligence(tenderId?: string): BidderIntelligence[] {
  if (!tenderId) return [];
  return bidderIntelligence.filter((b) => b.tenderId === tenderId);
}

// ------------------------------------------------------- derived views

export interface ComplianceCounts {
  total: number;
  compliant: number;
  needsReview: number;
  nonCompliant: number;
  missing: number;
  criticalFailures: number;
}

export function countResults(results: RequirementResult[], requirements: Requirement[]): ComplianceCounts {
  const mandatory = new Set(requirements.filter((r) => r.mandatory).map((r) => r.id));
  return {
    total: results.length,
    compliant: results.filter((r) => r.status === "compliant").length,
    needsReview: results.filter((r) => r.status === "needs-review").length,
    nonCompliant: results.filter((r) => r.status === "non-compliant").length,
    missing: results.filter((r) => r.status === "missing").length,
    criticalFailures: results.filter(
      (r) => mandatory.has(r.requirementId) && (r.status === "non-compliant" || r.status === "missing")
    ).length,
  };
}

export interface ReviewCase {
  bidderId: string;
  bidderName: string;
  tenderId: string;
  requirement: Requirement;
  result: RequirementResult;
}

/** Ambiguous cases routed to a human — the AI never closes these itself. */
export function getReviewQueue(tenderId?: string): ReviewCase[] {
  const requirements = getRequirements(tenderId);
  return getTenderIntelligence(tenderId).flatMap((intel) =>
    intel.results
      .filter((r) => r.status === "needs-review")
      .map((result) => {
        const requirement = requirements.find((req) => req.id === result.requirementId);
        return requirement
          ? { bidderId: intel.bidderId, bidderName: intel.bidderName, tenderId: intel.tenderId, requirement, result }
          : null;
      })
      .filter((c): c is ReviewCase => c !== null)
  );
}

/** Tender-wide risk roll-up used by the Risk Overview panel. */
export function aggregateRisk(tenderId?: string): RiskOverview {
  const all = getTenderIntelligence(tenderId);
  const sum = (pick: (r: RiskOverview) => number) => all.reduce((total, b) => total + pick(b.risk), 0);

  const criticalExceptions = sum((r) => r.criticalExceptions);
  const missingEvidence = sum((r) => r.missingEvidence);
  const conflictingEvidence = sum((r) => r.conflictingEvidence);
  const technicalConcerns = sum((r) => r.technicalConcerns);
  const reviewRequired = sum((r) => r.reviewRequired);

  const priorities = all.map((b) => b.risk.highestPriority);
  const highest =
    priorities.find((p) => p.risk === "high") ?? priorities[0] ?? {
      title: "No exceptions recorded",
      detail: "All evaluated requirements were satisfied deterministically.",
      risk: "low" as RiskLevel,
    };

  const level: RiskLevel = criticalExceptions >= 3 ? "high" : criticalExceptions > 0 || conflictingEvidence > 1 ? "medium" : "low";

  return {
    level,
    criticalExceptions,
    missingEvidence,
    conflictingEvidence,
    technicalConcerns,
    reviewRequired,
    highestPriority: highest,
  };
}

// ------------------------------------------------- bidder-side readiness

export interface ReadinessFix {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning";
  requirementLabel?: string;
  tenderValue?: string;
  bidderValue?: string;
  actionLabel: string;
  resolvedNote: string;
}

export interface BidReadinessData {
  tenderId: string;
  documentsRequired: number;
  requirementCoverage: number;
  readiness: number;
  checklist: DocumentCheck[];
  fixes: ReadinessFix[];
  consistency: ConsistencyField[];
  findings: ConsistencyFinding[];
}

/**
 * Pre-submission scan for the bid the logged-in bidder is currently
 * preparing. Deliberately shows an incomplete, imperfect draft.
 */
export const bidReadiness: BidReadinessData = {
  tenderId: "GEM/2026/B/458921",
  documentsRequired: 9,
  requirementCoverage: 91,
  readiness: 78,
  checklist: [
    { label: "GST Certificate", fileName: "GST_Certificate.pdf", status: "present", mandatory: true },
    { label: "PAN", fileName: "PAN_Card.pdf", status: "present", mandatory: true },
    { label: "Udyam Certificate", fileName: "Udyam_Certificate.pdf", status: "present", mandatory: true },
    { label: "Income Tax Documents", fileName: "Income_Tax_2025.pdf", status: "present", mandatory: true },
    {
      label: "EPFO Compliance Evidence",
      fileName: "EPFO_Certificate.pdf",
      status: "attention",
      mandatory: true,
      note: "Establishment code was read with low confidence — re-upload a clearer scan if available.",
    },
    { label: "ESIC Certificate", fileName: "ESIC_Certificate.pdf", status: "present", mandatory: true },
    { label: "Technical Proposal", fileName: "Technical_Proposal.pdf", status: "present", mandatory: true },
    { label: "Product Specification", fileName: "Product_Specification.pdf", status: "present", mandatory: true },
    { label: "OEM Authorization", status: "missing", mandatory: true, note: "Required by the tender — not yet uploaded." },
  ],
  fixes: [
    {
      id: "fix-oem",
      title: "Missing OEM Authorization",
      description: "This document is required by the tender.",
      severity: "critical",
      actionLabel: "Upload Document",
      resolvedNote: "OEM Authorization uploaded — document set is now complete.",
    },
    {
      id: "fix-warranty",
      title: "Warranty Requirement",
      description: "Your proposal states a shorter warranty than the tender requires.",
      severity: "warning",
      requirementLabel: "Warranty Period",
      tenderValue: "≥ 3 years",
      bidderValue: "2 years",
      actionLabel: "Review Technical Proposal",
      resolvedNote: "Technical proposal updated to a 3 year comprehensive warranty.",
    },
  ],
  consistency: [
    {
      field: "Company Name",
      consistent: false,
      rows: [
        { document: "GST Certificate", value: "Apex Medical Systems Pvt Ltd", page: 1 },
        { document: "PAN", value: "Apex Medical Systems Pvt Ltd", page: 1 },
        { document: "OEM Authorization", value: "Apex Medical Systems", page: 1 },
      ],
    },
    {
      field: "GSTIN",
      consistent: true,
      rows: [
        { document: "GST Certificate", value: "07ABCDE1234F1Z5", page: 1 },
        { document: "Bid Form", value: "07ABCDE1234F1Z5", page: 1 },
      ],
    },
  ],
  findings: [
    {
      id: "readiness-name-variation",
      title: "Potential Identity Variation",
      kind: "variation",
      detail: "OEM Authorization uses a shortened organization name.",
      risk: "medium",
      recommendation: "Ask your OEM to reissue the letter using your registered legal name.",
      sources: [
        { document: "GST Certificate", page: 1, value: "Apex Medical Systems Pvt Ltd" },
        { document: "OEM Authorization", page: 1, value: "Apex Medical Systems" },
      ],
    },
  ],
};

// ------------------------------------------------- government services

export type ConnectorState = "Live / Authorized" | "Sandbox" | "Simulated" | "Future";

export interface ServiceConnector {
  name: string;
  purpose: string;
  state: ConnectorState;
  note: string;
}

/**
 * Verification connectors. States are deliberately truthful: this
 * prototype has no authorized access to live government systems.
 */
export const serviceConnectors: ServiceConnector[] = [
  {
    name: "Udyam",
    purpose: "MSME registration lookup",
    state: "Simulated",
    note: "Demo dataset only. Production use requires authorised access.",
  },
  {
    name: "GST",
    purpose: "GSTIN status and legal name",
    state: "Simulated",
    note: "Values are read from submitted certificates, not from the GST network.",
  },
  {
    name: "DigiLocker",
    purpose: "Issuer-verified document fetch",
    state: "Future",
    note: "Not connected. Planned subject to authorisation.",
  },
  {
    name: "EPFO",
    purpose: "Establishment code verification",
    state: "Simulated",
    note: "Establishment codes are matched against demo records only.",
  },
  {
    name: "ESIC",
    purpose: "Employer registration check",
    state: "Simulated",
    note: "Certificate parsing only — no live registry call.",
  },
  {
    name: "Income Tax",
    purpose: "PAN / filing status",
    state: "Future",
    note: "Not connected. Planned subject to authorisation.",
  },
];

// ------------------------------------------------------- AI pipeline

export interface PipelineStage {
  id: string;
  name: string;
  role: string;
}

/**
 * NirnayAI is not one large chatbot — it is a chain of separate stages.
 */
export const aiPipeline: PipelineStage[] = [
  { id: "nlp", name: "AI / NLP", role: "Understands documents and tender language" },
  { id: "rules", name: "Rule Engine", role: "Performs objective comparisons" },
  { id: "evidence", name: "Evidence Layer", role: "Shows exactly where a result came from" },
  { id: "risk", name: "Risk Engine", role: "Prioritises important exceptions" },
  { id: "review", name: "Human Review", role: "Handles ambiguity and decides" },
];

// -------------------------------------------------- processing scripts

export const tenderAnalysisSteps = [
  { id: "read", label: "Reading document", description: "Loading tender document and annexures" },
  { id: "clauses", label: "Extracting clauses", description: "Segmenting eligibility, technical and delivery clauses" },
  { id: "requirements", label: "Identifying requirements", description: "Separating obligations from descriptive text" },
  { id: "rules", label: "Structuring rules", description: "Converting each requirement into a comparable rule" },
  { id: "index", label: "Indexing evidence", description: "Preparing the evidence index for bidder documents" },
];

export const bidEvaluationSteps = [
  { id: "read", label: "Reading documents", description: "Loading the submitted document set" },
  { id: "extract", label: "Extracting values", description: "Reading declared values and identifiers" },
  { id: "map", label: "Mapping requirements", description: "Linking each requirement to supporting evidence" },
  { id: "rules", label: "Checking deterministic rules", description: "Applying objective comparisons" },
  { id: "conflicts", label: "Detecting conflicts", description: "Comparing values across documents" },
  { id: "risk", label: "Ranking risks", description: "Prioritising mandatory exceptions" },
  { id: "queue", label: "Preparing review queue", description: "Routing ambiguous cases to a human reviewer" },
];

export const readinessScanSteps = [
  { id: "read", label: "Reading your documents", description: "Checking the uploaded document set" },
  { id: "complete", label: "Checking completeness", description: "Matching documents against the tender checklist" },
  { id: "requirements", label: "Mapping requirements", description: "Comparing your proposal to tender rules" },
  { id: "conflicts", label: "Detecting conflicts", description: "Looking for mismatches between your own documents" },
  { id: "summary", label: "Preparing summary", description: "Ranking what to fix before submission" },
];

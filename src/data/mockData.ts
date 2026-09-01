// Centralized mock data for Nirnay AI (frontend-only prototype)

export type VerificationStatus = "verified" | "pending" | "warning" | "failed";

export interface DocRecord {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: VerificationStatus;
  confidence?: number;
  aiNote?: string;
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  cin: string;
  pan: string;
  gstin: string;
  udyam: string;
  businessType: string;
  address: string;
  state: string;
  district: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  yearEstablished: string;
  category: string;
  verification: {
    gst: VerificationStatus;
    pan: VerificationStatus;
    udyam: VerificationStatus;
    company: VerificationStatus;
  };
  overallVerified: boolean;
  documents: DocRecord[];
}

export interface Tender {
  id: string;
  title: string;
  ministry: string;
  department: string;
  category: string;
  state: string;
  publishedDate: string;
  closingDate: string;
  evaluationDate: string;
  decisionDate: string;
  status: "Open" | "Under Evaluation" | "Closed" | "Awarded";
  eligibility: string[];
  requiredDocuments: string[];
  product: string;
  requiredQuantity: number;
  specifications: string;
  deliveryLocation: string;
  deliveryPeriod: string;
  bidsCount: number;
}

export interface ComplianceItem {
  label: string;
  status: VerificationStatus;
  note?: string;
}

export interface Bid {
  id: string;
  submissionId: string;
  tenderId: string;
  bidderId: string;
  bidderName: string;
  submittedDate: string | null;
  status: "Draft" | "Submitted" | "Under Government Review" | "Action Required" | "Approved" | "Rejected" | "Flagged";
  compliance: number;
  documentsComplete: string;
  quotation: {
    quantity: number;
    unitPrice: number;
    total: number;
    taxes: number;
    delivery: number;
    finalAmount: number;
  };
  productDetails: {
    product: string;
    manufacturer: string;
    availableQuantity: number;
    deliveryCapacity: string;
    warranty: string;
    technicalSpecs: string;
  };
  complianceItems: ComplianceItem[];
  warnings: { title: string; detail: string; severity: "warning" | "issue" }[];
  aiAssessment: {
    overall: number;
    documentMatch: number;
    eligibility: number;
    technicalCompliance: number;
    summary: string;
  };
  reasonForDecision?: string;
}

// ---------------- Companies ----------------
export const companies: Company[] = [
  {
    id: "apex-medical",
    name: "Apex Medical Systems Pvt. Ltd.",
    legalName: "Apex Medical Systems Private Limited",
    cin: "U33110DL2011PTC212345",
    pan: "AAFCA1234B",
    gstin: "07AAFCA1234B1Z5",
    udyam: "UDYAM-DL-03-0012345",
    businessType: "Private Limited Company",
    address: "Plot 22, Okhla Industrial Area, Phase III",
    state: "Delhi",
    district: "South East Delhi",
    contactPerson: "Rohan Mehta",
    email: "rohan.mehta@apexmedical.co.in",
    phone: "+91 98100 22345",
    website: "www.apexmedicalsystems.co.in",
    yearEstablished: "2011",
    category: "Medical Equipment",
    verification: { gst: "verified", pan: "verified", udyam: "verified", company: "verified" },
    overallVerified: true,
    documents: [
      { id: "d1", name: "GST_Certificate.pdf", type: "GST Certificate", uploadDate: "18 Aug 2026", status: "verified", confidence: 98 },
      { id: "d2", name: "PAN_Card.pdf", type: "PAN", uploadDate: "18 Aug 2026", status: "verified", confidence: 99 },
      { id: "d3", name: "Udyam_Certificate.pdf", type: "Udyam Certificate", uploadDate: "18 Aug 2026", status: "verified", confidence: 96 },
      { id: "d4", name: "Income_Tax_2025.pdf", type: "Income Tax Documents", uploadDate: "19 Aug 2026", status: "verified", confidence: 95 },
      { id: "d5", name: "EPFO_Certificate.pdf", type: "EPFO Certificate", uploadDate: "19 Aug 2026", status: "warning", confidence: 71, aiNote: "Establishment code partially matches records. Manual verification recommended." },
      { id: "d6", name: "ESIC_Certificate.pdf", type: "ESIC Certificate", uploadDate: "19 Aug 2026", status: "verified", confidence: 93 },
      { id: "d7", name: "Company_Registration.pdf", type: "Company Registration Certificate", uploadDate: "18 Aug 2026", status: "verified", confidence: 97 },
      { id: "d8", name: "Technical_Proposal.pdf", type: "Other Supporting Documents", uploadDate: "20 Aug 2026", status: "verified", confidence: 90 },
    ],
  },
  {
    id: "bharat-healthcare",
    name: "Bharat Healthcare Solutions",
    legalName: "Bharat Healthcare Solutions LLP",
    cin: "AAK-4521",
    pan: "AABFB5678C",
    gstin: "27AABFB5678C1ZR",
    udyam: "UDYAM-MH-05-0034521",
    businessType: "Limited Liability Partnership",
    address: "Unit 4, MIDC Industrial Estate, Andheri East",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    contactPerson: "Sunita Rao",
    email: "sunita.rao@bharathealthcare.in",
    phone: "+91 98200 44567",
    website: "www.bharathealthcare.in",
    yearEstablished: "2008",
    category: "Medical Equipment",
    verification: { gst: "verified", pan: "verified", udyam: "verified", company: "verified" },
    overallVerified: true,
    documents: [
      { id: "d1", name: "GST_Certificate.pdf", type: "GST Certificate", uploadDate: "17 Aug 2026", status: "verified", confidence: 96 },
      { id: "d2", name: "PAN_Card.pdf", type: "PAN", uploadDate: "17 Aug 2026", status: "verified", confidence: 97 },
      { id: "d3", name: "Udyam_Certificate.pdf", type: "Udyam Certificate", uploadDate: "17 Aug 2026", status: "verified", confidence: 94 },
      { id: "d4", name: "Income_Tax_2025.pdf", type: "Income Tax Documents", uploadDate: "18 Aug 2026", status: "verified", confidence: 91 },
      { id: "d5", name: "EPFO_Certificate.pdf", type: "EPFO Certificate", uploadDate: "18 Aug 2026", status: "verified", confidence: 89 },
      { id: "d6", name: "ESIC_Certificate.pdf", type: "ESIC Certificate", uploadDate: "18 Aug 2026", status: "warning", confidence: 68, aiNote: "Registration number formatting mismatch detected." },
      { id: "d7", name: "Company_Registration.pdf", type: "Company Registration Certificate", uploadDate: "17 Aug 2026", status: "verified", confidence: 95 },
      { id: "d8", name: "Technical_Proposal.pdf", type: "Other Supporting Documents", uploadDate: "19 Aug 2026", status: "verified", confidence: 88 },
    ],
  },
  {
    id: "nova-meditech",
    name: "Nova Meditech Pvt. Ltd.",
    legalName: "Nova Meditech Private Limited",
    cin: "U33112KA2015PTC087654",
    pan: "AAGCN4321D",
    gstin: "29AAGCN4321D1Z8",
    udyam: "UDYAM-KA-02-0076543",
    businessType: "Private Limited Company",
    address: "Tower B, Electronic City Phase I",
    state: "Karnataka",
    district: "Bengaluru Urban",
    contactPerson: "Arvind Kulkarni",
    email: "arvind.k@novameditech.com",
    phone: "+91 90350 77654",
    website: "www.novameditech.com",
    yearEstablished: "2016",
    category: "Medical Equipment",
    verification: { gst: "verified", pan: "warning", udyam: "verified", company: "verified" },
    overallVerified: false,
    documents: [
      { id: "d1", name: "GST_Certificate.pdf", type: "GST Certificate", uploadDate: "16 Aug 2026", status: "verified", confidence: 92 },
      { id: "d2", name: "PAN_Card.pdf", type: "PAN", uploadDate: "16 Aug 2026", status: "warning", confidence: 62, aiNote: "Name on PAN does not fully match registered legal name." },
      { id: "d3", name: "Udyam_Certificate.pdf", type: "Udyam Certificate", uploadDate: "16 Aug 2026", status: "verified", confidence: 90 },
      { id: "d4", name: "Income_Tax_2025.pdf", type: "Income Tax Documents", uploadDate: "17 Aug 2026", status: "warning", confidence: 58, aiNote: "Latest assessment year document missing." },
      { id: "d5", name: "EPFO_Certificate.pdf", type: "EPFO Certificate", uploadDate: "17 Aug 2026", status: "failed", confidence: 40, aiNote: "Establishment ID could not be matched." },
      { id: "d6", name: "ESIC_Certificate.pdf", type: "ESIC Certificate", uploadDate: "17 Aug 2026", status: "warning", confidence: 65 },
      { id: "d7", name: "Company_Registration.pdf", type: "Company Registration Certificate", uploadDate: "16 Aug 2026", status: "verified", confidence: 89 },
      { id: "d8", name: "Technical_Proposal.pdf", type: "Other Supporting Documents", uploadDate: "18 Aug 2026", status: "warning", confidence: 55, aiNote: "Connectivity specification not clearly demonstrated." },
    ],
  },
  {
    id: "zenith-surgical",
    name: "Zenith Surgical Equipment",
    legalName: "Zenith Surgical Equipment Pvt. Ltd.",
    cin: "U33119GJ2013PTC076541",
    pan: "AAHCZ6789E",
    gstin: "24AAHCZ6789E1ZP",
    udyam: "UDYAM-GJ-01-0098765",
    businessType: "Private Limited Company",
    address: "GIDC Industrial Estate, Vatva",
    state: "Gujarat",
    district: "Ahmedabad",
    contactPerson: "Priya Shah",
    email: "priya.shah@zenithsurgical.in",
    phone: "+91 99250 33221",
    website: "www.zenithsurgical.in",
    yearEstablished: "2013",
    category: "Medical Equipment",
    verification: { gst: "verified", pan: "verified", udyam: "verified", company: "verified" },
    overallVerified: true,
    documents: [
      { id: "d1", name: "GST_Certificate.pdf", type: "GST Certificate", uploadDate: "15 Aug 2026", status: "verified", confidence: 95 },
      { id: "d2", name: "PAN_Card.pdf", type: "PAN", uploadDate: "15 Aug 2026", status: "verified", confidence: 97 },
      { id: "d3", name: "Udyam_Certificate.pdf", type: "Udyam Certificate", uploadDate: "15 Aug 2026", status: "verified", confidence: 93 },
      { id: "d4", name: "Income_Tax_2025.pdf", type: "Income Tax Documents", uploadDate: "16 Aug 2026", status: "verified", confidence: 90 },
      { id: "d5", name: "EPFO_Certificate.pdf", type: "EPFO Certificate", uploadDate: "16 Aug 2026", status: "verified", confidence: 88 },
      { id: "d6", name: "ESIC_Certificate.pdf", type: "ESIC Certificate", uploadDate: "16 Aug 2026", status: "verified", confidence: 91 },
      { id: "d7", name: "Company_Registration.pdf", type: "Company Registration Certificate", uploadDate: "15 Aug 2026", status: "verified", confidence: 94 },
      { id: "d8", name: "Technical_Proposal.pdf", type: "Other Supporting Documents", uploadDate: "17 Aug 2026", status: "verified", confidence: 86 },
    ],
  },
];

// ---------------- Tenders ----------------
export const tenders: Tender[] = [
  {
    id: "GEM/2026/B/458921",
    title: "Supply of Medical Equipment",
    ministry: "Ministry of Health & Family Welfare",
    department: "Directorate General of Health Services",
    category: "Medical Equipment",
    state: "Delhi",
    publishedDate: "27 August 2026",
    closingDate: "15 September 2026",
    evaluationDate: "18 September 2026",
    decisionDate: "25 September 2026",
    status: "Under Evaluation",
    eligibility: ["GST Registration", "PAN", "Income Tax Compliance", "Udyam / MSME", "EPFO", "ESIC", "Make in India / Local Content"],
    requiredDocuments: ["GST Certificate", "PAN", "Udyam Certificate", "Income Tax Documents", "EPFO Certificate", "ESIC Certificate", "Technical Proposal", "Other Supporting Documents"],
    product: "Hospital Patient Monitoring Equipment",
    requiredQuantity: 500,
    specifications: "Multi-parameter display, SpO2/ECG/NIBP sensors, wireless connectivity, minimum 3-year warranty, CE/ISO certification required.",
    deliveryLocation: "New Delhi",
    deliveryPeriod: "90 days",
    bidsCount: 3,
  },
  {
    id: "GEM/2026/B/458774",
    title: "IT Infrastructure Modernization",
    ministry: "Ministry of Electronics & IT",
    department: "National Informatics Centre",
    category: "IT Infrastructure",
    state: "Karnataka",
    publishedDate: "20 August 2026",
    closingDate: "21 September 2026",
    evaluationDate: "24 September 2026",
    decisionDate: "30 September 2026",
    status: "Open",
    eligibility: ["GST Registration", "PAN", "Income Tax Compliance", "Udyam / MSME", "EPFO", "ESIC"],
    requiredDocuments: ["GST Certificate", "PAN", "Udyam Certificate", "Income Tax Documents", "EPFO Certificate", "ESIC Certificate", "Technical Proposal"],
    product: "Enterprise Server & Network Infrastructure",
    requiredQuantity: 120,
    specifications: "Rack servers, redundant power, minimum 5-year support contract, data localization compliance.",
    deliveryLocation: "Bengaluru",
    deliveryPeriod: "120 days",
    bidsCount: 5,
  },
  {
    id: "GEM/2026/B/459102",
    title: "Procurement of Solar Street Lighting Systems",
    ministry: "Ministry of New and Renewable Energy",
    department: "Solar Energy Corporation of India",
    category: "Renewable Energy",
    state: "Rajasthan",
    publishedDate: "12 August 2026",
    closingDate: "10 September 2026",
    evaluationDate: "14 September 2026",
    decisionDate: "20 September 2026",
    status: "Open",
    eligibility: ["GST Registration", "PAN", "Udyam / MSME", "Make in India / Local Content"],
    requiredDocuments: ["GST Certificate", "PAN", "Udyam Certificate", "Technical Proposal", "Other Supporting Documents"],
    product: "Solar LED Street Light Units",
    requiredQuantity: 2500,
    specifications: "Integrated solar panel, lithium battery, minimum 8-hour backup, IP65 rating, 2-year warranty.",
    deliveryLocation: "Jaipur",
    deliveryPeriod: "75 days",
    bidsCount: 2,
  },
  {
    id: "GEM/2026/B/459210",
    title: "Supply of Office Furniture & Fixtures",
    ministry: "Ministry of Housing & Urban Affairs",
    department: "Central Public Works Department",
    category: "Furniture",
    state: "Delhi",
    publishedDate: "5 August 2026",
    closingDate: "28 August 2026",
    evaluationDate: "2 September 2026",
    decisionDate: "8 September 2026",
    status: "Closed",
    eligibility: ["GST Registration", "PAN", "Udyam / MSME"],
    requiredDocuments: ["GST Certificate", "PAN", "Udyam Certificate", "Technical Proposal"],
    product: "Modular Office Workstations",
    requiredQuantity: 800,
    specifications: "Ergonomic design, fire-retardant laminate, standard government specification GFR-2017.",
    deliveryLocation: "New Delhi",
    deliveryPeriod: "60 days",
    bidsCount: 6,
  },
];

// ---------------- Bids ----------------
export const bids: Bid[] = [
  {
    id: "bid-1",
    submissionId: "BID-2026-084721",
    tenderId: "GEM/2026/B/458921",
    bidderId: "apex-medical",
    bidderName: "Apex Medical Systems Pvt. Ltd.",
    submittedDate: "27 August 2026",
    status: "Under Government Review",
    compliance: 94,
    documentsComplete: "9/9",
    quotation: { quantity: 500, unitPrice: 85000, total: 425000000, taxes: 0, delivery: 0, finalAmount: 425000000 },
    productDetails: {
      product: "Patient Monitoring System",
      manufacturer: "Apex Medical Systems",
      availableQuantity: 650,
      deliveryCapacity: "90 days",
      warranty: "3 years",
      technicalSpecs: "15-inch multi-parameter display, SpO2/ECG/NIBP/Temp sensors, WiFi + Bluetooth connectivity, central nursing station compatibility, CE and ISO 13485 certified.",
    },
    complianceItems: [
      { label: "GST Registration", status: "verified" },
      { label: "PAN", status: "verified" },
      { label: "Income Tax", status: "verified" },
      { label: "Udyam / MSME", status: "verified" },
      { label: "EPFO", status: "verified" },
      { label: "ESIC", status: "warning", note: "The submitted document requires additional verification." },
      { label: "Make in India", status: "verified" },
    ],
    warnings: [{ title: "ESIC Certificate", detail: "The submitted document requires additional verification.", severity: "warning" }],
    aiAssessment: {
      overall: 94,
      documentMatch: 97,
      eligibility: 92,
      technicalCompliance: 93,
      summary: "13 of 14 requirements are satisfied deterministically with linked evidence. One case (EPFO establishment code) was routed to human review. A shortened organisation name on the OEM letter is flagged as a medium-risk identity variation.",
    },
  },
  {
    id: "bid-2",
    submissionId: "BID-2026-084733",
    tenderId: "GEM/2026/B/458921",
    bidderId: "bharat-healthcare",
    bidderName: "Bharat Healthcare Solutions",
    submittedDate: "28 August 2026",
    status: "Under Government Review",
    compliance: 87,
    documentsComplete: "8/9",
    quotation: { quantity: 500, unitPrice: 82000, total: 410000000, taxes: 0, delivery: 0, finalAmount: 410000000 },
    productDetails: {
      product: "MediTrack Patient Monitor Pro",
      manufacturer: "Bharat Healthcare Solutions",
      availableQuantity: 550,
      deliveryCapacity: "100 days",
      warranty: "2 years",
      technicalSpecs: "12-inch display, SpO2/ECG/NIBP sensors, WiFi connectivity, ISO 13485 certified.",
    },
    complianceItems: [
      { label: "GST Registration", status: "verified" },
      { label: "PAN", status: "verified" },
      { label: "Income Tax", status: "verified" },
      { label: "Udyam / MSME", status: "verified" },
      { label: "EPFO", status: "verified" },
      { label: "ESIC", status: "warning", note: "Registration number formatting mismatch detected." },
      { label: "Make in India", status: "verified" },
    ],
    warnings: [
      { title: "Warranty Period", detail: "Offered warranty (2 years) is shorter than the mandatory 3-year minimum. Evidence: Product_Specification.pdf, page 7.", severity: "issue" },
      { title: "OEM Authorization", detail: "Mandatory OEM authorization letter was not located in the submitted document set.", severity: "issue" },
      { title: "Delivery Period", detail: "Committed delivery of 100 days exceeds the 90-day maximum.", severity: "issue" },
      { title: "EPFO Establishment Code", detail: "Code format differs from the expected pattern — routed to human review.", severity: "warning" },
    ],
    aiAssessment: {
      overall: 87,
      documentMatch: 90,
      eligibility: 88,
      technicalCompliance: 82,
      summary: "9 of 14 requirements are satisfied deterministically. Two mandatory requirements fail (warranty and delivery period) and the mandatory OEM authorization is missing. Two cases were routed to human review.",
    },
  },
  {
    id: "bid-3",
    submissionId: "BID-2026-084745",
    tenderId: "GEM/2026/B/458921",
    bidderId: "nova-meditech",
    bidderName: "Nova Meditech Pvt. Ltd.",
    submittedDate: "29 August 2026",
    status: "Flagged",
    compliance: 78,
    documentsComplete: "8/9",
    quotation: { quantity: 500, unitPrice: 81000, total: 405000000, taxes: 0, delivery: 0, finalAmount: 405000000 },
    productDetails: {
      product: "NovaVital Monitoring Unit",
      manufacturer: "Nova Meditech",
      availableQuantity: 500,
      deliveryCapacity: "110 days",
      warranty: "3 years",
      technicalSpecs: "10-inch display, SpO2/ECG/NIBP sensors, connectivity module optional add-on.",
    },
    complianceItems: [
      { label: "GST Registration", status: "verified" },
      { label: "PAN", status: "warning", note: "Name on PAN does not fully match registered legal name." },
      { label: "Income Tax", status: "warning", note: "Latest assessment year document missing." },
      { label: "Udyam / MSME", status: "verified" },
      { label: "EPFO", status: "failed", note: "Establishment ID could not be matched." },
      { label: "ESIC", status: "warning" },
      { label: "Make in India", status: "verified" },
    ],
    warnings: [
      { title: "Conflicting RAM Evidence", detail: "Technical_Proposal.pdf (16 GB) and Product_Brochure.pdf (8 GB) state different workstation memory.", severity: "issue" },
      { title: "NIBP Monitoring", detail: "Mandatory NIBP parameter is offered only as an optional add-on.", severity: "issue" },
      { title: "ISO 9001 Certificate", detail: "Mandatory quality certification was not located in the submitted document set.", severity: "issue" },
      { title: "Processor Equivalence", detail: "Ryzen 7 equivalence to the required i7 class could not be established automatically.", severity: "warning" },
    ],
    aiAssessment: {
      overall: 78,
      documentMatch: 68,
      eligibility: 70,
      technicalCompliance: 60,
      summary: "7 of 14 requirements are satisfied. Three mandatory requirements fail, one mandatory certificate is missing and three cases — including a cross-document RAM conflict — were routed to human review.",
    },
  },
  {
    id: "bid-4",
    submissionId: "BID-2026-081204",
    tenderId: "GEM/2026/B/458774",
    bidderId: "apex-medical",
    bidderName: "Apex Medical Systems Pvt. Ltd.",
    submittedDate: "22 August 2026",
    status: "Action Required",
    compliance: 78,
    documentsComplete: "6/7",
    quotation: { quantity: 120, unitPrice: 410000, taxes: 0, delivery: 0, total: 49200000, finalAmount: 49200000 },
    productDetails: {
      product: "Enterprise Rack Server Bundle",
      manufacturer: "Apex Systems (OEM Partner)",
      availableQuantity: 150,
      deliveryCapacity: "120 days",
      warranty: "5 years",
      technicalSpecs: "Dual redundant PSU, hot-swap storage bays, data localization compliant hosting.",
    },
    complianceItems: [
      { label: "GST Registration", status: "verified" },
      { label: "PAN", status: "verified" },
      { label: "Income Tax", status: "verified" },
      { label: "Udyam / MSME", status: "verified" },
      { label: "EPFO", status: "warning", note: "Establishment code partially matches records." },
      { label: "ESIC", status: "verified" },
    ],
    warnings: [{ title: "EPFO Certificate", detail: "Establishment code partially matches records. Manual verification recommended.", severity: "warning" }],
    aiAssessment: {
      overall: 78,
      documentMatch: 80,
      eligibility: 75,
      technicalCompliance: 82,
      summary: "EPFO establishment code requires manual confirmation before this bid can proceed to full compliance status.",
    },
  },
];

export const govMetrics = {
  activeTenders: 12,
  bidsAwaitingReview: 27,
  complianceIssues: 9,
  completedReviews: 84,
};

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

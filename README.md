# 🇮🇳 NirnayAI

## AI-Powered Bid Compliance & Procurement Intelligence Platform

> **Smarter Procurement. Stronger Compliance. Better Decisions.**

NirnayAI is an AI-assisted government procurement platform designed to simplify and improve the process of **bid submission, document verification, compliance assessment, bidder comparison, and procurement decision support**.

The platform connects **government procurement officers** with **bidder organizations**, allowing bidders to submit their company information, eligibility documents, technical proposals, and quotations, while enabling procurement officers to review and evaluate submitted bids through an intelligent compliance workflow.

The core idea behind NirnayAI is to reduce the amount of repetitive manual verification required during procurement while keeping the **final decision completely under human authority**.

> **AI assists. Evidence informs. Officers decide.**

---

## 🎯 Problem

Government procurement requires officers to examine large amounts of information and documentation submitted by different bidders.

Common requirements include:

* GST Registration
* PAN
* Income Tax Compliance
* Udyam / MSME Registration
* EPFO
* ESIC
* Make in India / Local Content
* Technical Eligibility
* Supporting Documents
* Product Specifications
* Bid Quotations

Manually checking these documents and comparing information across multiple submissions can be time-consuming and can make it difficult to identify inconsistencies.

NirnayAI introduces an intelligent layer that helps organize, analyze, and highlight important information for procurement officers.

---

## 💡 How NirnayAI Works

The platform consists of two primary portals.

### 🏛️ Government Portal

Procurement officers can:

* Review active tenders
* View submitted bids
* Compare bidders
* Verify submitted documents
* Review eligibility requirements
* Run AI compliance assessments
* Analyze technical proposals
* Identify inconsistencies and anomalies
* Review AI-generated findings
* Compare quotations and delivery information
* Generate procurement insights
* Approve or reject bids

The government officer remains responsible for the final procurement decision.

---

### 🏢 Bidder Portal

Bidder organizations can:

* Register their company
* Provide company information
* Complete company verification
* Browse available tenders
* Review tender requirements
* Upload required documents
* Submit technical proposals
* Provide quotations
* Run an AI pre-submission check
* Submit bids
* Track bid status
* View warnings and compliance issues

The bidder can therefore identify potential issues **before submitting the final bid**.

---

# 🤖 AI Capabilities

NirnayAI's main USP is its **AI-powered compliance intelligence workflow**.

### 1. AI Document Intelligence

The system analyzes submitted documents and extracts relevant information such as:

* Company name
* GSTIN
* Registration details
* PAN information
* Registration numbers
* Dates
* Compliance-related information

This extracted information can then be used for further verification.

---

### 2. Cross-Document Verification

NirnayAI compares information across multiple documents to detect inconsistencies.

For example:

```text
Company Profile
Apex Medical Systems Pvt. Ltd.

GST Certificate
Apex Medical Systems Pvt. Ltd.

PAN
Apex Medical Systems Pvt. Ltd.

Udyam Certificate
Apex Medical Systems Pvt. Ltd.
```

The AI can identify that the organization information is consistent.

If one document contains a different legal name or registration detail, the system can flag it:

> ⚠️ Organization information mismatch detected. Manual verification recommended.

---

### 3. Requirement-to-Document Mapping

The AI maps tender requirements to the evidence provided by the bidder.

Example:

| Requirement      | Evidence           | Status            |
| ---------------- | ------------------ | ----------------- |
| GST Registration | GST Certificate    | ✓ Verified        |
| PAN              | PAN Document       | ✓ Verified        |
| Udyam / MSME     | Udyam Certificate  | ✓ Verified        |
| EPFO             | EPFO Certificate   | ⚠ Review Required |
| ESIC             | ESIC Certificate   | ✓ Verified        |
| Make in India    | Technical Proposal | ✓ Evidence Found  |

This helps officers understand **which document supports each requirement**.

---

### 4. Technical Proposal Assessment

The system can compare tender specifications against the bidder's technical proposal.

For example:

```text
Tender Requirement:
Minimum Warranty — 3 Years

Bidder Proposal:
Warranty — 2 Years

AI Assessment:
✕ Requirement Not Satisfied
```

This allows technical compliance to be evaluated alongside document compliance.

---

### 5. Anomaly Detection

The AI can identify potential issues such as:

* Company name mismatches
* GSTIN inconsistencies
* Missing documents
* Registration number conflicts
* Address inconsistencies
* Expired documentation
* Technical specification mismatches
* Insufficient evidence
* Local-content inconsistencies

Each finding can provide an explanation and recommended action.

---

### 6. Explainable AI Assessment

Instead of simply showing a score such as:

**94% Compliance**

NirnayAI provides supporting context.

Example:

> **GST Registration — Compliant · 98% Confidence**
>
> GST registration information identified in the submitted certificate matches the bidder information provided during submission.

This allows procurement officers to understand **why** an AI assessment was generated.

---

### 7. Bid Comparison & Decision Support

Government officers can compare bidders using factors such as:

* Compliance
* Technical suitability
* Quotation
* Delivery period
* Document completeness
* Identified risks

The AI can highlight important differences between bidders without automatically selecting a winner.

For example:

> "Bidder B submitted a lower quotation but has a lower compliance score and longer delivery period."

The AI acts as a **decision-support system**, not an autonomous procurement authority.

---

# 🔄 Procurement Workflow

```text
Government Creates Tender
          ↓
Bidder Discovers Tender
          ↓
Bidder Registration & Verification
          ↓
Document Upload
          ↓
AI Pre-Submission Check
          ↓
Technical Proposal + Quotation
          ↓
Bid Submission
          ↓
Government Review
          ↓
AI Compliance Assessment
          ↓
Cross-Document Verification
          ↓
Technical Assessment
          ↓
Bidder Comparison
          ↓
Officer Review
          ↓
Final Approval / Rejection
```

---

# 🧠 Compliance Intelligence Layer

NirnayAI is deliberately **not one large AI model that outputs a single score**. The evaluation is split into
separate, inspectable stages, and the UI names each stage where it is used:

```text
AI / NLP Understanding  →  Rule Engine  →  Evidence Layer  →  Risk Engine  →  Human Review
   (reads documents)      (deterministic)   (doc + page)     (prioritises)    (officer decides)
```

| Stage | What it does | Where to see it |
| --- | --- | --- |
| **AI / NLP** | Reads the tender and the bidder's documents, extracts clauses and values | *Tender → AI Tender Analysis*, "Analyze Tender" sequence |
| **Rule Engine** | Applies deterministic rules such as `Warranty >= 3 years` | Requirement rows, requirement drawer |
| **Evidence Layer** | Links every extracted value to a document and page | "View Evidence" on any requirement |
| **Risk Engine** | Ranks conflicts, missing evidence and critical exceptions | *Risk* tab, Procurement Risk Overview |
| **Human Review** | Routes ambiguous results to an officer — never auto-approves | *Needs Review* queue, review decisions in the audit trail |

### Government portal

* **AI Tender Analysis** — tender text is turned into a structured requirement table (Requirement / Type / Rule / Mandatory).
* **Requirement-level compliance** — each bid shows `✓ compliant`, `⚠ needs review`, `✕ non-compliant`, `○ missing evidence`
  instead of one opaque percentage. The overall percentage remains only as a secondary metric and never hides a
  mandatory failure — **Critical Exceptions** are always surfaced separately.
* **Requirement drawer & evidence viewer** — rule, bidder value, status, source document + page, extracted quote,
  explanation and human review state.
* **Multi-bid compliance matrix** — requirements × bidders with filters for critical failures, needs review,
  missing evidence and high risk.
* **Human review queue** — ambiguous equivalence (for example `i7 or equivalent` vs `Ryzen 7`) is routed to an
  officer with Accept / Reject / Add Comment actions.
* **Document completeness** — mandatory documents that were never submitted are detected and reported.
* **Procurement Risk Overview** — overall risk level, breakdown and the highest-priority issue.
* **Decision history** — an audit timeline from AI analysis through evidence, risk flags and the officer's decision.
* **Compliance report** — an auditable per-bidder table: requirement, rule, value, result, evidence page, explanation
  and review decision.
* **Government Services Hub** — every connector (Udyam, GST, DigiLocker, EPFO, ESIC, Income Tax) carries an explicit
  state badge. In this prototype they are **Simulated** or **Future**; the same component supports
  **Live / Authorized** and **Sandbox** once an integration is actually approved. The prototype never claims live
  government API access.

### Bidder portal

* **AI Bid Readiness Check** — document completeness, requirement coverage, potential issues, critical issues and a
  readiness score with "Fix Before Submission" actions. It is guidance only and is never presented as approval.
* **AI Consistency Check** — the bidder's own documents are compared against each other so identity variations and
  conflicting values are corrected before submission.
* **Bid status** — the same requirement-level results and evidence the officer sees, so feedback is explainable.

### Data

All intelligence data lives in `src/data/intelligenceData.ts` (requirements, per-bidder results, evidence,
consistency findings, risk, audit entries and connector states). The reusable UI lives in `src/components/intel/`.
Demo data intentionally contains realistic failures — a warranty conflict, a missing OEM authorization and a RAM
value that disagrees across two documents — so the workflow can be demonstrated end to end.

---

# 🛠️ Technology Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Framer Motion**
* **Lucide Icons**

### Current Prototype

The current version uses:

* Mock tender data
* Mock bidder data
* Simulated document verification
* Simulated AI analysis
* Frontend-based demonstration workflows

The architecture is designed so that the simulated AI layer can later be replaced with real AI services, OCR pipelines, databases, and authorized government APIs.

---

# 💻 Running NirnayAI Locally

## Prerequisites

Make sure you have installed:

* **Node.js 18+**
* **npm**
* **Git**

You can check your versions with:

```bash
node -v
npm -v
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/nirnay-ai.git
```

Move into the project directory:

```bash
cd nirnay-ai
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start the Development Server

```bash
npm run dev
```

The application should start locally.

Open:

```text
http://localhost:5173
```

in your browser.

---

## 4. Build for Production

To verify that the application builds correctly:

```bash
npm run build
```

Then run the production build:

```bash
npm start
```

---

# ⚠️ Prototype Disclaimer

NirnayAI is currently a **proof-of-concept / demonstration project**.

The current implementation uses simulated procurement data and AI analysis for demonstration purposes. It is **not connected to real Government of India databases or GeM systems**.

Any production deployment would require appropriate government authorization, secure infrastructure, verified data sources, security controls, and authorized integrations.

---

## 🇮🇳 NirnayAI

### AI-Powered Bid Compliance & Procurement Intelligence

> **Smarter Procurement. Stronger Compliance. Better Decisions.**

**AI assists. Evidence informs. Officers decide.**

// Everything the site says lives in this file. Edit text here; the
// components only handle layout and animation.
//
// Any entry with `placeholder: true` is shown with a dashed "placeholder"
// badge on the page so it is easy to spot. Replace the text and delete the
// flag once it is real.

export type Placeholder = { placeholder?: boolean };

export const profile = {
  name: "Eva Yang",
  nativeName: "", // optional: your Chinese name, shown under the headline
  status: "Open to supply chain specialist & S&OP planning roles", // small badge above your name; "" hides it
  headline: "Supply Chain, AI Integration & Dashboards", // used in the browser tab title
  rolePrefix: "I work on",
  roles: ["AI integration", "dashboards & data visualization", "supply chain & S&OP planning", "data you can trust"],
  tagline:
    "I integrate AI into real operations and build the dashboards that run them. I took a student-housing business from spreadsheets and email to one platform with 18 AI workflows in production and live dashboards for occupancy, leasing and cost.",
  location: "United States", // placeholder: add your city
  locationPlaceholder: true,
  github: "https://github.com/yangkeren0720",
  linkedin: "", // add your LinkedIn URL to show the button
  email: "", // add a public contact email to show the button
  resumeUrl: "", // e.g. "/resume.pdf" after adding the file to /public
};

export const about = {
  paragraphs: [
    "I own operations outcomes end to end. RBR Property Management ran on spreadsheets, email and several separate vendor tools. I mapped the whole flow, from available rooms to applications, contracts and move-in, and, with no coding background, built one system by directing AI to replace the manual handoffs: live availability, an occupancy calendar, automated lease contracts and move-in emails that go out on their own. Then I put AI to work on the steps that still took people hours.",
    "The work I'm proudest of is the unglamorous part: reconciling records across systems until there is one source of truth, catching pricing errors before they reach a contract, and adding checks so the same mistake can't happen twice. That is the operations and supply chain work I want to keep scaling.",
  ],
  // Short facts shown as chips next to the bio.
  facts: [
    { label: "Strengths", value: "AI integration, dashboards, data visualization" },
    { label: "Looking for", value: "Supply chain specialist and S&OP planner roles" },
    { label: "Currently", value: "Leading operations systems and AI at RBR Property Management" },
    { label: "Education", value: "Add your school and degree", placeholder: true },
    { label: "Languages", value: "English, 中文" },
  ] as Array<{ label: string; value: string } & Placeholder>,
};

// Results from the RBR work (October 2026).
export const statsNote = "Results from operations work at RBR Property Management.";
export const stats = [
  { value: 18, suffix: "", label: "AI-powered workflows running in production" },
  { value: 182, suffix: "", label: "lease records unified into one source of truth" },
  { value: 127, suffix: "", label: "pricing errors caught before reaching a contract" },
  { value: 65, suffix: "", label: "lost applications recovered" },
];

export type Experience = {
  period: string;
  title: string;
  org: string;
  summary: string;
  highlights: string[];
} & Placeholder;

export const experience: Experience[] = [
  {
    period: "2025 — Present",
    title: "Add your title at RBR", // replace with your real title
    org: "RBR Property Management",
    summary:
      "Own operations systems and AI strategy for a student-housing company: room inventory, applications, leasing, move-ins and the vendor tools around them.",
    highlights: [
      "Built live dashboards for occupancy, open rooms per house, leasing and AI cost per feature, with drill-down from a chart to the records behind it, plus an AI box that answers questions from the same numbers.",
      "Put 18 AI-powered workflows into production, each with a human check where mistakes are costly, per-feature cost tracking, and the choice of a cheaper model where it does the job.",
      "Consolidated 182 leases from four vendor and legacy sources into one table with clear source-of-truth rules, driving an occupancy calendar the team plans from.",
      "Automated the order-to-contract flow: approved applications become DocuSign-ready leases from a clause-level template, and signed leases write back to the records automatically.",
      "Found a systematic rent and fee mix-up in imported vendor data and corrected it on 127 leases before any contract went out.",
      "Recovered 65 lost rental applications from notification emails, then added backups and a recycle bin so it can't recur.",
      "Replaced manual data entry in a vendor system with no API by AI agents that learn the office's own written rules, run in practice mode first, and email a report of every success and failure.",
      "Moved room availability from flat files to a database with an audit trail on every change, and set up monitoring and alerts so problems surface early.",
    ],
    placeholder: true, // confirm the title and dates
  },
  {
    period: "20XX — 20XX",
    title: "Your previous role",
    org: "Company or internship",
    summary: "One line on what the team did and what you owned.",
    highlights: [
      "A result with a number, e.g. cut page load time by 40%.",
      "Something you built or led.",
    ],
    placeholder: true,
  },
  {
    period: "20XX — 20XX",
    title: "Degree",
    org: "University",
    summary: "Major, minor, relevant coursework or honors.",
    highlights: [],
    placeholder: true,
  },
];

// "Dashboards & data visualization" section. The demo itself uses the
// made-up numbers in content/dashboard.ts.
export const dashboards = {
  intro:
    "I build dashboards that turn operational data into decisions: live KPIs, charts you can drill into, and an AI assistant that answers questions from the same numbers. Try the demo below; it runs on sample data shaped like the dashboards I built at RBR.",
  points: [
    {
      title: "One source of truth",
      body: "The dashboard, the reports and the AI assistant read the same numbers, so nobody argues about whose spreadsheet is right.",
    },
    {
      title: "From chart to record",
      body: "Tap a day or a house to see the records behind it. A dashboard should answer the next question, not just the first one.",
    },
    {
      title: "AI that can read the data",
      body: "Managers ask in plain English and get answers from live data through read-only, checked queries, with the chart that backs it up.",
    },
  ],
};

// "AI in operations" section: how AI is used at RBR, all in production.
export const ai = {
  title: "I put AI to work where operations lose time.",
  intro:
    "Each AI feature at RBR replaces a step the team used to do by hand. All of them run in production today, with guardrails so people stay in control of anything that matters.",
  uses: [
    {
      icon: "chat",
      title: "Customer replies",
      body: "A WhatsApp inbox where AI learns from past conversations and live room availability, then drafts replies for the team to approve. Nothing is sent without a person.",
    },
    {
      icon: "robot",
      title: "Vendor data-entry agents",
      body: "AI agents enter signed leases, request move-in inspections and post last-month rent in a vendor system that has no API, following the office's own written rules.",
    },
    {
      icon: "doc",
      title: "Contract reading",
      body: "Signed lease PDFs, including scanned paper, are read into structured records: tenant, room, dates, rent and sign dates, with no retyping.",
    },
    {
      icon: "pen",
      title: "Contract drafting",
      body: "An assistant on each lease drafts changes and addenda in plain language. The draft goes to a preview and is only saved when someone approves it.",
    },
    {
      icon: "chart",
      title: "Ask the business anything",
      body: "Managers type a question like \"how many rooms are open for spring?\" and get the answer from live data through read-only, checked queries.",
    },
    {
      icon: "spark",
      title: "Customer self-service",
      body: "Website visitors who finish the Room Match quiz can ask questions; AI answers from public facts only and suggests up to three rooms.",
    },
  ],
  guardrails: [
    "Human approval before anything is sent",
    "Practice mode before agents go live",
    "Sensitive data redacted before it reaches AI",
    "Read-only access for questions",
    "Cost tracked per feature",
    "Right-sized model for each task",
  ],
  builtWith:
    "I'm not a programmer. I built this whole platform by directing AI, for about $300 a month: I describe what the business needs, review what it builds, cross-check the results against real records, and flag anything that needs fixing.",
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  accent: string;
} & Placeholder;

export const featured = {
  name: "RBR Property Management",
  tagline: "The operations system a student-housing company runs on",
  description:
    "Room inventory, applications, leasing, move-ins and tenant communication in one place, replacing spreadsheets, email and several separate vendor tools.",
  link: "https://www.rbrpmrealty.com",
  tags: ["Process automation", "Inventory & occupancy", "Vendor integration", "Data reconciliation", "PostgreSQL", "DocuSign", "AI agents"],
  // Each item becomes a tab in the interactive showcase.
  features: [
    {
      title: "Live Room Inventory",
      body: "Every house, room and floorplan with live availability, plus a Room Match quiz that pairs students with rooms that fit their budget and habits.",
      screen: "houses",
    },
    {
      title: "Online Applications",
      body: "A multi-step application that saves as you go, with document uploads and answers stored in a searchable database, so no applicant falls through the cracks.",
      screen: "apply",
    },
    {
      title: "Lease Automation",
      body: "Applicants link to rooms with an agreed rent, the generator fills the lease template, DocuSign sends it, and the signed envelope writes the lease back to the database.",
      screen: "lease",
    },
    {
      title: "Occupancy Planning",
      body: "An occupancy calendar across every room, with leases, move-in checklists, automatic emails and a full change history, all filterable and sortable.",
      screen: "admin",
    },
    {
      title: "AI Assistants",
      body: "A WhatsApp reply assistant that drafts answers from past conversations and live availability for a human to approve, plus a browser robot that handles a vendor workflow with no API.",
      screen: "ai",
    },
  ],
};

export const projects: Project[] = [
  {
    name: "Vendor Robot",
    tagline: "Automating a vendor with no API",
    description:
      "Every new tenant needed a move-in inspection requested by hand in a vendor tool with no API. An AI browser agent now fills in each request, starting in practice mode and only sending after a person approves.",
    tags: ["Process automation", "AI agents", "Vendor management"],
    accent: "#86efac",
  },
  {
    name: "RBR Admin for iOS",
    tagline: "Operations on the go",
    description:
      "A native iPhone app so the team can check availability, applications and leases away from a desk, built on the same data as the web dashboard.",
    tags: ["SwiftUI", "iOS", "OpenAPI"],
    accent: "#7dd3fc",
  },
  {
    name: "This website",
    tagline: "Animated personal site",
    description:
      "Built with Next.js and Framer Motion, exported as a static site and deployed to GitHub Pages by a GitHub Actions workflow.",
    tags: ["Next.js", "TypeScript", "Framer Motion"],
    repo: "https://github.com/yangkeren0720/my-personal-website",
    accent: "#c4b5fd",
  },
  {
    name: "Your next project",
    tagline: "Add a supply chain or operations project",
    description: "A class project, case competition or job where you improved a process. Say what you changed and one number that shows it worked.",
    tags: ["Skill", "Tool"],
    accent: "#fca5a5",
    placeholder: true,
  },
];

export const skills = [
  "AI Integration", "LLM Agents", "Dashboards", "Data Visualization", "KPI Design",
  "Process Mapping", "Process Automation", "Inventory & Occupancy Planning",
  "Vendor Management", "Data Reconciliation", "Root-cause Analysis",
  "Dashboards & Reporting", "Workflow Design", "Contract Automation",
  "Capacity Planning", "Cross-referencing & Data Validation",
  "AI-assisted Development", "Prompting & AI Agents", "English & 中文",
];

// Short "how I work" principles. Phrase them in your own words.
export const principles = [
  {
    title: "Start from the customer",
    body: "Every change began with a student, parent or teammate who was stuck. I watch where the process breaks before I change it.",
  },
  {
    title: "Own it end to end",
    body: "I map the process, fix the data, automate the handoffs, and get the alert when something breaks.",
  },
  {
    title: "Dive into the data",
    body: "Real leases and real money depend on these records, so I check them against the source documents, audit every change, and make duplicates impossible.",
  },
  {
    title: "Simplify, then automate",
    body: "Cut the steps that don't need to exist first, then automate what's left, with a human check where mistakes would be costly.",
  },
];

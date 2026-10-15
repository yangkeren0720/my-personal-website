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
  status: "Seeking Supply Chain Specialist & S&OP Planner roles", // small badge above your name; "" hides it
  headline: "Supply Chain & S&OP Planning",
  title: "Supply Chain & S&OP Planner", // big line under your name // used in the browser tab title
  rolePrefix: "Planning powered by",
  roles: ["AI integration", "live dashboards", "data visualization", "clean, reconciled data"],
  tagline:
    "I plan supply against demand. At the student-housing company I co-own, I manage inventory (rooms), demand (applications), capacity and vendors, and I built the AI tools and live dashboards that keep the plan accurate.",
  location: "United States", // placeholder: add your city
  locationPlaceholder: true,
  github: "https://github.com/yangkeren0720",
  linkedin: "", // add your LinkedIn URL to show the button
  email: "", // add a public contact email to show the button
  resumeUrl: "", // e.g. "/resume.pdf" after adding the file to /public
};

export const about = {
  paragraphs: [
    "I took a business running on spreadsheets and email and, with no coding background, directed AI to build one system for the whole chain: inventory, demand, orders and fulfillment.",
  ],
  // Short facts shown as chips next to the bio.
  facts: [
    { label: "Strengths", value: "Supply & demand planning, AI integration, dashboards, data visualization" },
    { label: "Looking for", value: "Supply chain specialist and S&OP planner roles" },
    { label: "Currently", value: "Co-owner of RBR Property Management, running its operations, systems and AI" },
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
    title: "Co-Owner",
    org: "RBR Property Management",
    summary:
      "Run operations, systems and AI for a student-housing company I co-own.",
    highlights: [
      "Built live supply & demand dashboards with drill-down and an AI ask box.",
      "Put 18 AI workflows into production, each with a human check.",
      "Unified 182 leases from 4 sources; caught 127 pricing errors.",
      "Recovered 65 lost applications and added backups so it can't recur.",
    ],
    placeholder: true, // confirm the start year
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
    "Click around. It runs on sample data shaped like the dashboards I built at RBR.",
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
  title: "I use AI to run supply chain work faster and with fewer errors.",
  intro:
    "All of these run in production at RBR. Watch them work:",
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
    "I'm not a programmer. I built this whole platform by directing AI, for about $300 a month, and I cross-check everything it builds against real records.",
};

// Section 01: Supply chain. The dashboard demo follows it on the page.
export const supplyChain = {
  title: "Supply chain planning, end to end.",
  intro:
    "Rooms are inventory, applications are demand, leases are orders, move-ins are fulfillment. I run the whole chain.",
  capabilities: [
    {
      title: "Supply & demand planning",
      body: "A rolling view of open rooms for this term and the next two, matched against incoming applications, so we fill capacity before it goes empty.",
    },
    {
      title: "Inventory & capacity",
      body: "Live availability for every room across every house, with an occupancy calendar that shows gaps and overlaps at a glance.",
    },
    {
      title: "Order to fulfillment",
      body: "Approved applications become leases, leases become move-ins, and move-in emails and inspections go out on schedule without anyone chasing them.",
    },
    {
      title: "Vendor management",
      body: "Data flows between our property, signing and messaging vendors, including a vendor with no API, which AI agents now handle.",
    },
    {
      title: "Data accuracy",
      body: "I cross-reference records across systems and flag anything that needs updating: 182 leases reconciled into one source of truth and 127 pricing errors caught before a contract went out.",
    },
    {
      title: "KPIs & reporting",
      body: "Summary dashboards for rooms, leases, applicants and semesters, plus scheduled report emails, so decisions use the same numbers everywhere.",
    },
  ],
};

// Section 03: Management.
export const management = {
  title: "I run the business, not just the project.",
  intro:
    "Every vendor, system and teammate, connected through one operation I run.",
  areas: [
    {
      title: "Business ownership",
      body: "Co-own and operate a student-housing company: leasing strategy, pricing, tenant experience and the systems behind them.",
    },
    {
      title: "Process & standards",
      body: "Written rules for every repeatable job, which both the team and the AI agents follow, plus checklists, audit trails and a change history on every record.",
    },
    {
      title: "Risk & compliance",
      body: "A weekly report flags deposits that haven't been refunded within the 30-day window, and sensitive data like door codes never leaves the system.",
    },
    {
      title: "Team enablement",
      body: "Admin tools with step-by-step guides built in, and an assistant that tells the team which page to use for any task.",
    },
  ],
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
    "Inventory, demand, orders and fulfillment in one system, replacing spreadsheets and email.",
  link: "https://www.rbrpmrealty.com",
  tags: ["Process automation", "Inventory & occupancy", "Vendor integration", "Data reconciliation", "PostgreSQL", "DocuSign", "AI agents"],
  // Each item becomes a tab in the interactive showcase.
  features: [
    {
      title: "Live Room Inventory",
      body: "Live availability for every room, plus a quiz that matches students to rooms.",
      screen: "houses",
    },
    {
      title: "Online Applications",
      body: "A save-as-you-go application, so no applicant falls through the cracks.",
      screen: "apply",
    },
    {
      title: "Lease Automation",
      body: "Approved applicant to signed lease, with no retyping.",
      screen: "lease",
    },
    {
      title: "Occupancy Planning",
      body: "One calendar for every room, lease and move-in.",
      screen: "admin",
    },
    {
      title: "AI Assistants",
      body: "AI drafts replies and handles vendor data entry, with a person in control.",
      screen: "ai",
    },
  ],
};

export const projects: Project[] = [
  {
    name: "Vendor Robot",
    tagline: "Automating a vendor with no API",
    description:
      "An AI agent files move-in inspections in a vendor tool with no API.",
    tags: ["Process automation", "AI agents", "Vendor management"],
    accent: "#86efac",
  },
  {
    name: "RBR Admin for iOS",
    tagline: "Operations on the go",
    description:
      "The team checks rooms, applications and leases from their phones.",
    tags: ["SwiftUI", "iOS", "OpenAPI"],
    accent: "#7dd3fc",
  },
  {
    name: "This website",
    tagline: "Animated personal site",
    description:
      "Built by directing AI, deployed automatically on every change.",
    tags: ["Next.js", "TypeScript", "Framer Motion"],
    repo: "https://github.com/yangkeren0720/my-personal-website",
    accent: "#c4b5fd",
  },
  {
    name: "Your next project",
    tagline: "Add a supply chain or operations project",
    description: "A process you improved, and one number that shows it worked.",
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

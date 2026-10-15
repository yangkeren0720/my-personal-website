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
    "Material Planner in semiconductor manufacturing, with 5+ years in supply chain across Tesla, Rivian and wafer-fab programs. I keep critical materials flowing, and I build the AI tools and live dashboards that keep the plan accurate.",
  location: "Austin, TX",
  locationPlaceholder: false,
  github: "https://github.com/yangkeren0720",
  linkedin: "https://www.linkedin.com/in/eva-yang-637993116/",
  email: "", // add a public contact email to show the button
  resumeUrl: "", // e.g. "/resume.pdf" after adding the file to /public
};

export const about = {
  paragraphs: [
    "I plan materials for a semiconductor fab, I bought for automotive factory build-outs, and I co-own a business where I directed AI to build one system for the whole chain.",
  ],
  // Short facts shown as chips next to the bio.
  facts: [
    { label: "Strengths", value: "Supply & demand planning, AI integration, dashboards, data visualization" },
    { label: "Looking for", value: "Supply chain specialist and S&OP planner roles" },
    { label: "Currently", value: "Material Planner (semiconductor) and co-owner of RBR Property Management" },
    { label: "Education", value: "M.S. & B.S. Mathematics, Illinois State University · ASCM planning certificate" },
    { label: "Languages", value: "English, 中文 (native)" },
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
  place?: string;
  summary: string;
  highlights: string[];
  // Sub-assignments shown as small chips, e.g. customer programs.
  programs?: { name: string; place: string; period: string }[];
  // Buttons that jump to the demos for this role.
  links?: { label: string; href: string }[];
  kind?: "work" | "education";
} & Placeholder;

export const experience: Experience[] = [
  {
    period: "Dec 2023 — Present",
    title: "Material Planner",
    org: "SkyWater Technology (began under Infineon Technologies)",
    place: "Austin, TX",
    summary: "Plan demand and supply for critical wafer-fab materials: specialty gases, CMP slurry, photoresist and process chemicals.",
    highlights: [
      "Built a weekly weeks-of-supply risk dashboard that feeds S&OP and MPS decisions.",
      "Rebuilt reorder points, min/max and safety stock from 12 months of usage, then moved materials to MRP auto-release.",
      "Spotted a single-source chemical stockout weeks ahead with a depletion model; production never stopped.",
      "Grew the shortage-risk report from ~100 to ~250 material lines, and kept supply running through two acquisitions.",
    ],
    links: [
      { label: "Safety stock demo", href: "#safety-stock" },
      { label: "Stockout early warning", href: "#early-warning" },
      { label: "Supply risk heatmap", href: "#risk-heatmap" },
    ],
  },
  {
    period: "2023 — Present",
    title: "Co-Owner",
    org: "RBR Property Management",
    place: "Student housing",
    summary: "Run operations, systems and AI for a business I co-own with my husband.",
    highlights: [
      "Built live supply & demand dashboards with drill-down and an AI ask box.",
      "Put 18 AI workflows into production, each with a human check.",
      "Unified 182 leases from 4 sources; caught 127 pricing errors.",
    ],
    links: [
      { label: "RBR platform", href: "#work" },
      { label: "Supply chain flow", href: "#supply-chain" },
      { label: "Live dashboard", href: "#dashboards" },
      { label: "AI demos", href: "#ai" },
      { label: "Management", href: "#management" },
    ],
  },
  {
    period: "Feb 2026 — Present",
    title: "Office Manager (part-time)",
    org: "Belong Automotive Technology",
    place: "Austin, TX",
    summary: "Run day-to-day operations, procurement, import/export logistics and HR.",
    highlights: [
      "Direct procurement, supplier coordination, customs and freight forwarding.",
      "Led the company's Odoo ERP rollout: 114 tasks across 4 phases.",
    ],
  },
  {
    period: "Jun 2020 — Oct 2023",
    title: "Purchasing Analyst",
    org: "Mino Automation USA",
    place: "Supplier partner to Tesla, Rivian and Faraday Future",
    summary: "Purchasing and capacity planning for automotive body-in-white and battery line build-outs.",
    highlights: [
      "Rivian: 3,400+ PO lines ($10M) for 372 robots across 7 lines.",
      "Tesla Cybertruck: staffed 179 contract trades for the ramp and cut labor cost 20%.",
      "Taught myself Power Automate and built an approval workflow that cut missed invoices 50%.",
    ],
    programs: [
      { name: "Tesla Cybertruck", place: "Austin, TX", period: "2022–23" },
      { name: "Faraday Future FF91", place: "Hanford, CA", period: "2022–23" },
      { name: "Tesla Megapack", place: "Lathrop, CA", period: "2022" },
      { name: "Rivian", place: "Normal, IL", period: "2021–22" },
    ],
    links: [{ label: "EV program spend", href: "#ev-programs" }],
  },
  {
    period: "2015 — Dec 2021",
    title: "Mathematics",
    org: "Illinois State University · Illinois Wesleyan University",
    place: "Illinois",
    summary: "M.S. and B.S. Mathematics (Illinois State, Dec 2021); B.A. Mathematics & Music (Illinois Wesleyan); minor in Computer Science. ASCM planning certificate.",
    highlights: [],
    kind: "education",
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

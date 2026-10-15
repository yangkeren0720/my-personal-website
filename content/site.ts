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
  status: "Open to new opportunities", // small badge above your name; "" hides it
  headline: "Operations & Supply Chain", // used in the browser tab title
  rolePrefix: "I work on",
  roles: ["operations & supply chain", "process automation", "data you can trust", "vendor & systems integration"],
  tagline:
    "I make operations run smoothly. At a student-housing company I mapped how a room goes from listing to signed lease, automated the handoffs, reconciled data across vendors, and built the dashboards the team runs on.",
  location: "United States", // placeholder: add your city
  locationPlaceholder: true,
  github: "https://github.com/yangkeren0720",
  linkedin: "", // add your LinkedIn URL to show the button
  email: "", // add a public contact email to show the button
  resumeUrl: "", // e.g. "/resume.pdf" after adding the file to /public
};

export const about = {
  paragraphs: [
    "I like owning a process end to end. RBR Property Management ran on spreadsheets, email and several separate vendor tools. I mapped the whole flow, from available rooms to applications, contracts and move-in, and replaced the manual handoffs with one system: live availability, an occupancy calendar, automated lease contracts and move-in emails that go out on their own.",
    "The work I'm proudest of is the unglamorous part: reconciling records across systems until there is one source of truth, catching pricing errors before they reach a contract, and adding checks so the same mistake can't happen twice. That is the kind of operations and supply chain work I want to keep doing.",
  ],
  // Short facts shown as chips next to the bio.
  facts: [
    { label: "Focus", value: "Operations, process automation, data" },
    { label: "Looking for", value: "Supply chain and operations roles" },
    { label: "Currently", value: "Running operations systems at RBR Property Management" },
    { label: "Education", value: "Add your school and degree", placeholder: true },
    { label: "Languages", value: "English, 中文" },
  ] as Array<{ label: string; value: string } & Placeholder>,
};

// Results from the RBR work (October 2026).
export const statsNote = "Results from operations work at RBR Property Management.";
export const stats = [
  { value: 182, suffix: "", label: "lease records unified into one source of truth" },
  { value: 4, suffix: "", label: "data sources reconciled into one" },
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
    title: "Operations & Systems Lead",
    org: "RBR Property Management",
    summary:
      "Own the operations systems for a student-housing company: room inventory, applications, leasing, move-ins and the vendor tools around them.",
    highlights: [
      "Consolidated 182 leases from four vendor and legacy sources into one table with clear source-of-truth rules, driving an occupancy calendar the team plans from.",
      "Automated the order-to-contract flow: approved applications become DocuSign-ready leases from a clause-level template, and signed leases write back to the records automatically.",
      "Found a systematic rent and fee mix-up in imported vendor data and corrected it on 127 leases before any contract went out.",
      "Recovered 65 lost rental applications from notification emails, then added backups and a recycle bin so it can't recur.",
      "Automated a manual vendor workflow that had no API using an AI browser agent, with a practice mode and human sign-off before going live.",
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
  "Process Mapping", "Process Automation", "Inventory & Occupancy Planning",
  "Vendor Management", "Data Reconciliation", "Root-cause Analysis",
  "Dashboards & Reporting", "Workflow Design", "Contract Automation",
  "SQL", "PostgreSQL", "AI Agents", "TypeScript", "Next.js", "SwiftUI",
  "GitHub Actions", "Azure", "English & 中文",
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

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
  roles: ["Software Engineer", "Full-stack Builder", "Product Owner", "Problem Solver"],
  tagline:
    "I build software that runs a real business, from the tenant-facing website to the admin tools, database and automations behind it.",
  location: "United States", // placeholder: add your city
  locationPlaceholder: true,
  github: "https://github.com/yangkeren0720",
  linkedin: "", // add your LinkedIn URL to show the button
  email: "", // add a public contact email to show the button
  resumeUrl: "", // e.g. "/resume.pdf" after adding the file to /public
};

export const about = {
  paragraphs: [
    "I like owning a problem end to end. At RBR Property Management I took a business that ran on spreadsheets, email and third-party tools and built the system it now runs on: a public housing website, an online application flow, an admin dashboard for leases and availability, and automations that send leases, emails and reminders on their own.",
    "I care about the details that customers feel, like an application that saves as you go, and about the data underneath it staying correct when real people and real money depend on it.",
  ],
  // Short facts shown as chips next to the bio.
  facts: [
    { label: "Focus", value: "Full-stack web, data, automation" },
    { label: "Currently", value: "Building RBR Property Management's platform" },
    { label: "Education", value: "Add your school and degree", placeholder: true },
    { label: "Languages", value: "English, 中文" },
  ] as Array<{ label: string; value: string } & Placeholder>,
};

// Numbers counted from the RBR codebase (October 2026).
export const stats = [
  { value: 181, suffix: "", label: "API routes" },
  { value: 171, suffix: "", label: "database models" },
  { value: 96, suffix: "", label: "schema migrations shipped" },
  { value: 135, suffix: "k", label: "lines of code" },
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
    title: "Software Engineer & Product Owner",
    org: "RBR Property Management",
    summary:
      "Designed and built the company's web platform and internal tools on Next.js, PostgreSQL and Azure.",
    highlights: [
      "Migrated the platform from flat files to a normalized PostgreSQL schema with audit history and a rollback path.",
      "Built a lease generator that turns approved applications into DocuSign-ready contracts from a clause-level template, and writes signed leases back to the database.",
      "Consolidated 182 leases from four sources into one table with de-duplication rules, driving an occupancy calendar.",
      "Found and fixed a systematic rent and fee mix-up in imported lease data before it reached any contract.",
      "Recovered lost rental applications from notification emails, then added backups and a recycle bin so it can't recur.",
      "Built an AI browser agent, run from CI, that automates a vendor workflow with no API, with a practice mode and human sign-off before going live.",
      "Set up CI/CD with automated migrations, uptime monitoring and alerting for the production app on Azure.",
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
  tagline: "The platform a student-housing company runs on",
  description:
    "A public website where students browse houses and apply, plus the admin system the team uses every day for availability, applications, leases, move-ins and tenant communication.",
  link: "https://www.rbrpmrealty.com",
  tags: ["Next.js", "React", "PostgreSQL", "Prisma", "Azure", "DocuSign API", "Claude API", "GitHub Actions"],
  // Each item becomes a tab in the interactive showcase.
  features: [
    {
      title: "Houses & Room Match",
      body: "Public pages for every house with floorplans, rooms and live availability, plus a Room Match quiz that pairs students with rooms that fit their budget and habits.",
      screen: "houses",
    },
    {
      title: "Online Applications",
      body: "A multi-step application with drafts that save as you go, document uploads to Azure Blob Storage, and answers stored in relational tables admins can search.",
      screen: "apply",
    },
    {
      title: "Lease Automation",
      body: "Applicants link to rooms with an agreed rent, the generator fills the lease template, DocuSign sends it, and the signed envelope writes the lease back to the database.",
      screen: "lease",
    },
    {
      title: "Admin Dashboard",
      body: "Leases, an occupancy calendar, properties, move-in checklists, automatic emails and a full change history, all filterable and sortable.",
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
    name: "RBR Admin for iOS",
    tagline: "SwiftUI companion app",
    description:
      "A native SwiftUI app for the RBR admin team, built on a versioned admin API with an OpenAPI spec. Swift types are generated from the spec so the app and server can't drift, and sign-in tokens live in the Keychain.",
    tags: ["SwiftUI", "iOS", "OpenAPI"],
    accent: "#7dd3fc",
  },
  {
    name: "Vendor Robot",
    tagline: "AI browser agent",
    description:
      "A GitHub Actions job that runs a headless browser where Claude fills in move-in inspection requests in a vendor tool with no API. It starts in practice mode and only sends after a person approves.",
    tags: ["Claude API", "Headless Chromium", "GitHub Actions"],
    accent: "#86efac",
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
    tagline: "Add a school, hackathon or side project",
    description: "What it does, what you built, and one number that shows it worked.",
    tags: ["Tech", "Stack"],
    accent: "#fca5a5",
    placeholder: true,
  },
];

export const skills = [
  "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "SwiftUI",
  "PostgreSQL", "Prisma", "SQL", "Azure App Service", "Azure Blob Storage",
  "Application Insights", "GitHub Actions", "REST APIs", "DocuSign eSignature",
  "Claude API", "HTML & CSS", "Git",
];

// Short "how I work" principles. Phrase them in your own words.
export const principles = [
  {
    title: "Start from the customer",
    body: "Every feature began with a student, parent or teammate who was stuck. I watch where they get stuck before I write code.",
  },
  {
    title: "Own it end to end",
    body: "I design the schema, build the API and the UI, deploy it, and get the alert email when it breaks.",
  },
  {
    title: "Keep the data right",
    body: "Real leases and real deposits live in this database, so migrations are reversible, changes are audited, and duplicates are impossible by design.",
  },
  {
    title: "Ship, then simplify",
    body: "Small releases to production, then cleaning up what turned out to be unnecessary.",
  },
];

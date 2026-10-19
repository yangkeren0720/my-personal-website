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
  status: "Open to Senior Supply Chain, S&OP and Procurement roles", // small badge above your name; "" hides it
  headline: "Senior Supply Chain & S&OP Planner who builds software",
  title: "Senior Supply Chain & S&OP Planner", // big line under your name // used in the browser tab title
  rolePrefix: "who also builds",
  roles: ["software", "websites", "live dashboards"],
  // Proof chips under the tagline: each one jumps to the work that backs it.
  // All of it is RBR work (and this site), never SkyWater.
  builds: [
    { label: "Software", detail: "Admin system + iPhone app", href: "#rbr-build" },
    { label: "Websites", detail: "rbrpmrealty.com and this site", href: "#work" },
    { label: "Dashboards", detail: "Rooms, leases, AI cost", href: "#work" },
  ],
  // Four counting-up numbers that replace a paragraph in the hero. Each one
  // names its employer; no AI wording next to the SkyWater number.
  heroStats: [
    { value: 5, suffix: "+", label: "years planning supply" },
    { value: 10, prefix: "$", suffix: "M", label: "in POs for one EV line build (Mino)" },
    { value: 0, label: "production stops at the wafer fab (SkyWater)" },
    { value: 5, label: "direct reports (Belong)" },
  ],
  tagline:
    "Material Planner at SkyWater, keeping a wafer fab supplied with critical materials. Before that, purchasing and capacity planning for EV line build-outs at Mino Automation. Outside SkyWater, I manage five departments at Belong and co-own a property business whose software, website and dashboards I built by directing AI.",
  location: "Austin, TX",
  locationPlaceholder: false,
  github: "https://github.com/yangkeren0720",
  linkedin: "https://www.linkedin.com/in/eva-yang-637993116/",
  email: "eva@evayangscm.com",
  phone: "(309) 684-8387",
  phoneHref: "+13096848387",
  resumeUrl: "", // e.g. "/resume.pdf" after adding the file to /public
};

export type Program = {
  name: string;
  place: string;
  period: string;
  job: string;
  did: [string, string, string];
  kpis: { value: string; label: string }[];
  // One visual per panel: a crew mix, a process flow, or a SkyWater story visual.
  crew?: { label: string; n: number }[];
  flow?: string[];
  visual?: "reset" | "report" | "runout" | "parallel" | "buffer";
};

export type Experience = {
  period: string;
  title: string;
  org: string;
  place?: string;
  summary: string;
  highlights: string[];
  // Clickable chips (customer programs, or key stories) that open a short
  // animated panel showing what Eva did there.
  programsLabel?: string;
  programs?: Program[];
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
    programsLabel: "Tap a story to see what I did",
    programs: [
      {
        name: "Took over CMP planning",
        place: "Ownership",
        period: "MRP reset",
        job: "Inherited CMP materials after a layoff, with no handover or documentation.",
        did: ["Worked backward from ERP history, lead times and usage.", "Reset min/max and lead times item by item.", "Moved the items to MRP auto-release; planning stabilized."],
        kpis: [
          { value: "MRP", label: "auto-release replaced manual orders" },
          { value: "Stable", label: "planning after the reset" },
        ],
        visual: "reset",
      },
      {
        name: "Shortage-risk report",
        place: "Dive Deep",
        period: "~100 → ~250",
        job: "The zero-bin report relied on past usage, so new materials never showed up.",
        did: ["Found the gap: items with no history were invisible.", "Rebuilt the logic to include new and low-history items.", "Made the report the weekly shortage review."],
        kpis: [
          { value: "~250", label: "materials now visible" },
          { value: "2.5×", label: "the old coverage" },
        ],
        visual: "report",
      },
      {
        name: "A run-out the ERP hid",
        place: "Dive Deep",
        period: "Single-source",
        job: "A single-source delivery slipped, but the ERP still showed enough supply.",
        did: ["Rebuilt the run-out date from daily use, open POs and confirmed dates.", "Set daily control with engineering, warehouse, procurement and the supplier.", "Inventory hit about one bottle; the shipment arrived in time."],
        kpis: [
          { value: "~1 bottle", label: "at the low point" },
          { value: "0", label: "production stops" },
        ],
        visual: "runout",
      },
      {
        name: "Packaging change",
        place: "Bias for Action",
        period: "4 paths",
        job: "A supplier packaging change failed its first qualification.",
        did: ["Started four recovery paths at the same time.", "Pulled stock from the supplier, other sites and an alternate batch.", "Pushed re-qualification through; production kept running."],
        kpis: [
          { value: "4", label: "paths in parallel" },
          { value: "0", label: "production stops" },
        ],
        visual: "parallel",
      },
      {
        name: "End-of-life buy",
        place: "Are Right, A Lot",
        period: "In progress",
        job: "A chemical is reaching end of life, and its shelf life is only six months.",
        did: ["Weighed actual usage swings and qualification risk.", "Proposed a 100-bottle shared buffer on the 200-bottle baseline.", "Aligned the team on 300 bottles for the final batch."],
        kpis: [
          { value: "300", label: "bottles requested" },
          { value: "6 mo", label: "shelf life to respect" },
        ],
        visual: "buffer",
      },
    ],
    links: [
      { label: "Story timeline", href: "#skywater" },
      { label: "Safety stock demo", href: "#safety-stock" },
      { label: "Stockout early warning", href: "#early-warning" },
      { label: "Weeks-of-inventory view", href: "#woi" },
      { label: "More SkyWater stories", href: "#skywater-stories" },
    ],
  },
  {
    period: "Feb 2026 — Present",
    title: "Office Manager (part-time)",
    org: "Belong Automotive Technology",
    place: "Austin, TX · part-time",
    summary: "Oversee operations, purchasing, HR, IT and warehouse; report to the US CEO and work with US and China leadership.",
    highlights: [
      "Led the ERP choice (Odoo vs. NetSuite, SAP, custom) and a 160-page design with a 114-task plan.",
      "Fixed under-licensed engineering software: ~$100K over 3 years, ~40% below the top quote.",
      "Run procurement, import/export, customs and freight, plus full-cycle hiring.",
    ],
    links: [
      { label: "ERP story", href: "#ex-odoo" },
      { label: "Licensing story", href: "#ex-cad" },
      { label: "Departments & ERP", href: "#belong" },
    ],
  },
  {
    period: "Jun 2021 — Oct 2023",
    title: "Purchasing Analyst",
    org: "Mino Automation USA",
    place: "Supplier partner to Tesla, Rivian and Faraday Future",
    summary: "Purchasing and capacity planning for automotive body-in-white and battery line build-outs.",
    highlights: [
      "Rivian: 3,400+ PO lines ($10M) for 372 robots across 7 lines.",
      "Tesla Cybertruck: staffed 179 contract trades for the ramp and cut labor cost 20%.",
      "Taught myself Power Automate and built an approval workflow that cut missed invoices 50%.",
    ],
    programsLabel: "Tap a program to see what I did",
    programs: [
      {
        name: "Tesla Cybertruck",
        place: "Austin, TX",
        period: "Sep 2022 – Sep 2023",
        job: "Supply and labor capacity planning for the body-in-white line ramp.",
        did: ["Sourced and onboarded 179 contract trades, all through the customer's safety onboarding.", "Negotiated labor rates down 20% and ran 34+ equipment rentals: welders, lifts, cranes.", "Built the cost-tracking template and managed time-and-materials and turnkey contracts."],
        kpis: [
          { value: "179", label: "trades staffed" },
          { value: "−20%", label: "labor cost" },
          { value: "34+", label: "equipment rentals" },
        ],
        crew: [
          { label: "Millwrights", n: 80 },
          { label: "Electricians", n: 70 },
          { label: "Robot programmers", n: 15 },
          { label: "PLC programmers", n: 6 },
          { label: "Riggers", n: 4 },
          { label: "Crane operators", n: 4 },
        ],
      },
      {
        name: "Faraday Future FF91",
        place: "Hanford, CA",
        period: "Apr 2022 – Jan 2023",
        job: "Purchasing and crew sourcing to install and commission 54 robots across 7 lines.",
        did: ["Sourced 51 trades: mechanical installers, electricians and a PLC programmer.", "Lined up 10+ pieces of mobile equipment and service from 8+ equipment makers.", "Audited the process equipment for completeness before commissioning."],
        kpis: [
          { value: "54", label: "robots" },
          { value: "7", label: "lines" },
          { value: "51", label: "trades sourced" },
        ],
        crew: [
          { label: "Mechanical installers", n: 30 },
          { label: "Electricians", n: 20 },
          { label: "PLC programmer", n: 1 },
        ],
      },
      {
        name: "Tesla Megapack",
        place: "Lathrop, CA",
        period: "Feb – Apr 2022",
        job: "Spare parts and long-lead buys for line installation and commissioning.",
        did: ["Planned the spare parts the install and commissioning would need.", "Expedited long-lead items and handled supplier escalations.", "Negotiated a turnkey commissioning project."],
        kpis: [
          { value: "Turnkey", label: "commissioning deal" },
          { value: "3 mo", label: "install window" },
        ],
        flow: ["Spare-parts plan", "Long-lead buys", "Escalations", "Turnkey commissioning"],
      },
      {
        name: "Rivian",
        place: "Normal, IL",
        period: "Jun 2021 – Feb 2022",
        job: "Purchasing and crew sourcing for a 7-line body-in-white build with 372 robots.",
        did: ["Placed 3,400+ PO lines worth $10M.", "Sourced 300+ technicians across mechanical, electrical, robot and PLC work.", "Escalated long-lead items to keep installation on schedule."],
        kpis: [
          { value: "3,400+", label: "PO lines" },
          { value: "$10M", label: "purchased" },
          { value: "372", label: "robots" },
        ],
        crew: [
          { label: "Mechanical installers", n: 120 },
          { label: "Electricians", n: 100 },
          { label: "Robot programmers", n: 60 },
          { label: "PLC programmers", n: 30 },
        ],
      },
    ],
    links: [
      { label: "Program timeline", href: "#mino" },
      { label: "Capacity story", href: "#capacity" },
      { label: "Invoice workflow", href: "#invoice-flow" },
      { label: "EV program spend", href: "#ev-programs" },
      { label: "More Mino stories", href: "#mino-stories" },
    ],
  },
  {
    period: "2023 — Present",
    title: "Co-Owner",
    org: "RBR Property Management",
    place: "Austin area · side business",
    summary: "Co-own a student-housing business with 8 houses and 41 rooms, and designed the system it runs on: room inventory, demand, leases and move-ins in one place, with dashboards to plan each semester. Built by directing Claude Code and Codex, each cross-checking the other, with every output checked against real records.",
    highlights: [
      "Built operations dashboards for 41 rooms: a live inventory of every room's status, a semester-by-semester capacity plan, an occupancy calendar and vacancy by house and quarter.",
      "Launched the platform behind them (public website, 35-screen admin system and an iPhone/iPad app) and shipped 364 live updates in 7 months.",
      "Automated the path from application to signed lease to move-in, cutting hands-on time per new lease from about 1 hour 40 minutes to about 15 minutes.",
      "Put 19 AI features into production, including 3 robots that do TenantCloud data entry, saving about 180 hours of office work a year.",
    ],
    programsLabel: "Tap a project to see what I did",
    programs: [
      {
        name: "Operations dashboards",
        place: "Admin system",
        period: "2026",
        job: "One live view of supply and demand for every room, so each semester is planned before it starts.",
        did: [
          "Built a live room inventory with six states (open, pending, filled, not listed, freeing up, signed to finish) by house and room.",
          "Built a semester capacity plan: rooms carried over, newly signed, waiting for signature and still open, three semesters ahead.",
          "Added an occupancy calendar and a vacancy rate by house and quarter, with the counting rule written on the page.",
        ],
        kpis: [
          { value: "41", label: "rooms tracked live" },
          { value: "6", label: "room states" },
          { value: "3", label: "semesters planned ahead" },
        ],
        flow: ["Inventory", "Demand", "Leases", "Move-ins"],
      },
      {
        name: "Lease pipeline",
        place: "Website + admin",
        period: "2026",
        job: "Application to signed lease to move-in, with no retyping between steps.",
        did: [
          "Online application that saves as you go and links the applicant to the room they want.",
          "Lease Generator fills the lease from the application; one click sends it to DocuSign.",
          "Robots enter the signed lease, deposit and move-in inspection in TenantCloud, and 12 automatic emails go out along the way.",
        ],
        kpis: [
          { value: "~15 min", label: "hands-on per new lease" },
          { value: "~1 h 40", label: "per lease before" },
          { value: "12", label: "automatic emails" },
        ],
        flow: ["Apply", "Lease", "DocuSign", "TenantCloud", "Move-in"],
      },
      {
        name: "AI in operations",
        place: "Claude API",
        period: "2026",
        job: "AI features in production, each with its own model, effort level and daily budget.",
        did: [
          "Robots that enter leases, request move-in inspections and prorate last-month rent in TenantCloud, which has no API.",
          "WhatsApp reply drafts and a signed-lease PDF reader; nothing is sent or saved until a person approves.",
          "Every AI call is logged with its cost, with a monthly budget warning.",
        ],
        kpis: [
          { value: "19", label: "AI features" },
          { value: "3", label: "TenantCloud robots" },
          { value: "~180 h", label: "office work saved a year" },
        ],
        flow: ["Read", "Draft", "Person approves", "Save"],
      },
      {
        name: "iPhone & iPad app",
        place: "Swift / SwiftUI",
        period: "2026",
        job: "A native admin app on the same live data, so the business runs from a phone.",
        did: [
          "32 native screens for rooms, applicants, leases and settings.",
          "184 API endpoints shared with the website, written down in an OpenAPI contract.",
          "Built by Codex and reviewed by Claude, with a test server of made-up data.",
        ],
        kpis: [
          { value: "32", label: "app screens" },
          { value: "184", label: "API endpoints" },
        ],
        flow: ["Database", "API contract", "Website", "App"],
      },
      {
        name: "Data platform",
        place: "PostgreSQL on Azure",
        period: "2026",
        job: "All business data moved out of scattered files into one database that the website and app share.",
        did: [
          "196 tables and 111 schema migrations, moved over in 9 batches.",
          "Change history with undo, plus backups and a recycle bin.",
          "Hosting and services kept to about $45–80 a month.",
        ],
        kpis: [
          { value: "196", label: "tables" },
          { value: "111", label: "migrations" },
          { value: "$45–80", label: "a month" },
        ],
        flow: ["Old files", "9 batches", "PostgreSQL", "Website + app"],
      },
      {
        name: "AI build process",
        place: "Claude Code + Codex",
        period: "2026",
        job: "How a non-programmer ships software safely: one AI builds, the other reviews.",
        did: [
          "Write a brief for each task: the goal, files allowed to change, checks to run and what done means.",
          "Claude builds the website and Codex the app; each reviews the other's work, sorted into must fix, should fix and note.",
          "Every change runs on a test database first; one nightly release goes live after my typed approval.",
        ],
        kpis: [
          { value: "364", label: "live updates in 7 months" },
          { value: "~39,000", label: "checks in one release test" },
          { value: "36", label: "audit issues fixed" },
        ],
        flow: ["Brief", "Build", "Cross-review", "Test copy", "Release"],
      },
    ],
    links: [
      { label: "Dashboards", href: "#work" },
      { label: "On the phone", href: "#rbr-phone" },
      { label: "How it's built", href: "#rbr-build" },
      { label: "AI demos", href: "#ai" },
    ],
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

// "AI in operations" section: how AI is used at RBR, all in production.
export const ai = {
  title: "I use AI to run my property business faster and with fewer errors.",
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
      title: "TenantCloud data-entry agents",
      body: "AI agents enter signed leases, request move-in inspections and post last-month rent in TenantCloud, which has no API, following the office's own written rules.",
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
    "I'm not a programmer. I build with Claude Code and Codex, have each one cross-check the other's work, then check everything against real records. About $300 a month.",
};

export const featured = {
  name: "RBR Property Management",
  tagline: "The operations system a student-housing company runs on",
  description:
    "Inventory, demand, orders and fulfillment in one system, replacing spreadsheets and email.",
  link: "https://www.rbrpmrealty.com",
  tags: ["Process automation", "Inventory & occupancy", "Vendor integration", "Data reconciliation", "PostgreSQL", "DocuSign", "AI agents"],
  // Each item becomes a tab in the interactive showcase. `video` is a real
  // screen recording in /public/rbr (public pages from the live site, admin
  // screens from a test copy with made-up data); `path` is the address shown
  // in the browser bar.
  features: [
    {
      title: "Operations Dashboard",
      body: "Today's work queue and a semester-by-semester plan for every room: carried over, newly signed, waiting for signature and still open, plus vacancy by house and quarter.",
      screen: "admin",
      video: "/rbr/rbr-dashboard.mp4",
      poster: "/rbr/rbr-dashboard.jpg",
      path: "rbrpmrealty.com/admin",
    },
    {
      title: "Inventory & Occupancy",
      body: "Every room's status at a glance (open, pending, filled, freeing up), then a month-by-month occupancy calendar of every lease and move-in.",
      screen: "admin",
      video: "/rbr/rbr-inventory.mp4",
      poster: "/rbr/rbr-inventory.jpg",
      path: "rbrpmrealty.com/admin?tab=availability",
    },
    {
      title: "Live Room Inventory",
      body: "The public side of the same data: every open room on the website, live from the database the dashboards use, with house photos and an interactive floor plan.",
      screen: "houses",
      video: "/rbr/rbr-home.mp4",
      poster: "/rbr/rbr-home.jpg",
      path: "rbrpmrealty.com",
    },
    {
      title: "Room Match Quiz",
      body: "Eight quick questions rank today's open rooms by fit, then the student applies in one click.",
      screen: "houses",
      video: "/rbr/rbr-room-match.mp4",
      poster: "/rbr/rbr-room-match.jpg",
      path: "rbrpmrealty.com/room-match",
    },
    {
      title: "Online Applications",
      body: "A save-as-you-go application, so no applicant falls through the cracks.",
      screen: "apply",
      video: "/rbr/rbr-apply.mp4",
      poster: "/rbr/rbr-apply.jpg",
      path: "rbrpmrealty.com/application",
    },
    {
      title: "Lease Automation",
      body: "Approved applicant to signed lease, with no retyping.",
      screen: "lease",
      video: "/rbr/rbr-lease-generator.mp4",
      poster: "/rbr/rbr-lease-generator.jpg",
      path: "rbrpmrealty.com/admin/lease-generator",
    },
    {
      title: "Robots & Lease Flows",
      body: "Every lease scenario mapped step by step: what the website does, what the TenantCloud robots do, and what is left for a person.",
      screen: "lease",
      video: "/rbr/rbr-lease-flows.mp4",
      poster: "/rbr/rbr-lease-flows.jpg",
      path: "rbrpmrealty.com/admin/lease-flows",
    },
  ] as { title: string; body: string; screen: string; video?: string; poster?: string; path?: string }[],
  recordingNote: "Real screen recordings. Admin and app screens show made-up sample data.",
};

// The RBR platform's own numbers, its phone views and how it is built.
// Counts are from the platform's code and release history (Oct 2026).
export const rbrPlatform = {
  kpis: [
    { value: 41, label: "rooms in 8 houses run on the platform" },
    { value: 364, label: "live updates shipped in 7 months" },
    { value: 19, label: "AI features in production, each with its own model and budget" },
  ],
  devices: [
    {
      title: "The public site on a phone",
      body: "Every page works on a phone: house photos, floor plans and the live room list.",
      video: "/rbr/rbr-phone.mp4",
      poster: "/rbr/rbr-phone.jpg",
      kind: "web",
    },
    {
      title: "The iPhone & iPad admin app",
      body: "A native Swift app with 32 screens that runs the same admin actions as the website, so the business runs from a phone.",
      video: "/rbr/rbr-app.mp4",
      poster: "/rbr/rbr-app.jpg",
      kind: "app",
    },
  ],
  stack: [
    { group: "Website", items: ["Next.js 15", "React 19", "JavaScript"] },
    { group: "Data", items: ["PostgreSQL", "Prisma", "Change history & undo"] },
    { group: "Cloud", items: ["Microsoft Azure", "GitHub Actions CI/CD"] },
    { group: "App", items: ["Swift / SwiftUI", "OpenAPI contract"] },
    { group: "Integrations", items: ["DocuSign", "Microsoft 365 & sign-in", "TenantCloud", "WhatsApp", "Google Maps"] },
    { group: "AI", items: ["Claude API (Opus, Sonnet, Haiku)", "Claude Code", "OpenAI Codex"] },
  ],
  numbers: [
    { value: 196, label: "database tables" },
    { value: 111, label: "schema migrations" },
    { value: 184, label: "API endpoints shared by site and app" },
    { value: 35, label: "admin screens" },
    { value: 39000, prefix: "~", label: "automated checks in one release test" },
    { value: 80, prefix: "$45–", label: "a month for hosting and services" },
  ] as { value: number; prefix?: string; label: string }[],
  // Value stream for one new lease: hands-on minutes by hand versus now (rough
  // estimates from the robots' step lists, so the site says "about").
  workflow: [
    { step: "Write the lease and send it to sign", who: "Website", before: 45, now: 10, how: "The Lease Generator fills it from the application; one click sends it to DocuSign." },
    { step: "Enter the lease in TenantCloud", who: "Robot", before: 20, now: 2, how: "A robot adds the tenant, dates, rent, prorated first month, deposit and signed PDF." },
    { step: "Move-in email and inspection", who: "Robot", before: 15, now: 1, how: "Door code, Wi-Fi and checklist go out 5 days ahead; a robot assigns the inspection." },
    { step: "Welcome and setup emails", who: "Website", before: 10, now: 0, how: "Sent automatically once everyone has signed." },
    { step: "Last-month rent proration", who: "Robot", before: 7, now: 1, how: "A robot prorates rent and the cleaning fee when a lease ends mid-month." },
  ],
  // How each change is made: two AI coding agents, one builds and the other reviews.
  loop: [
    { step: "Brief", body: "I write the goal, the files allowed to change, the checks to run and what done means." },
    { step: "Build", body: "One AI builds it on its own branch: Claude for the website, Codex for the app." },
    { step: "Cross-review", body: "The other AI reviews every change. The same model never builds and reviews." },
    { step: "Test copy", body: "Each change runs on a test database with made-up data, never on live records." },
    { step: "Nightly release", body: "Finished work is combined and tested together, then goes live after my typed approval." },
  ],
};

export const skills = [
  "Material Planning", "S&OP / SIOP", "MRP & ERP", "Safety Stock & Min/Max", "Demand Forecasting",
  "Supplier Management", "Strategic Sourcing", "Capacity Planning", "Purchasing & POs",
  "Shortage Risk Dashboards", "Data Visualization", "Power Automate & SharePoint",
  "SQL", "Advanced Excel", "AI Integration", "Lean / Six Sigma", "English & 中文",
];

// "Two skills, one method" band right after the hero. Planning numbers name
// their employer. Builder proof is RBR and this site (AI-built) and Mino's
// workflow (self-taught, before AI). Never SkyWater on the builder side.
// RBR counts come from the RBR code as of 2026-10-19; re-count when updating.
export const builds = {
  planning: [
    { value: 3400, suffix: "+", label: "PO lines on one EV line build", org: "Mino" },
    { value: 372, label: "robots across 7 lines on that build", org: "Mino" },
    { value: 300, suffix: "+", label: "skilled technicians sourced", org: "Mino" },
    { value: 250, prefix: "~", label: "materials on the weekly shortage review", org: "SkyWater" },
    { value: 2, label: "acquisitions with supply kept running", org: "SkyWater" },
    { value: 5, label: "direct reports across five departments", org: "Belong" },
  ],
  method: ["Gather the signals", "Find the constraint", "Pick the trade-off", "Check against real records"],
  tiles: [
    { label: "Software", number: "196 tables · 184 endpoints", detail: "Admin system + iPhone app", href: "#rbr-build", video: "/rbr/rbr-lease-generator.mp4", poster: "/rbr/rbr-lease-generator.jpg" },
    { label: "Websites", number: "2 live sites", detail: "rbrpmrealty.com and this site", href: "#work", video: "/rbr/rbr-home.mp4", poster: "/rbr/rbr-home.jpg" },
    { label: "Dashboards", number: "6 live dashboards", detail: "Rooms, leases, applicants, AI cost", href: "#work", video: "/rbr/rbr-dashboard.mp4", poster: "/rbr/rbr-dashboard.jpg" },
  ],
  how: [
    { label: "I write the spec", who: "Eva", mine: true },
    { label: "Claude Code builds it", who: "AI", mine: false },
    { label: "Codex checks it", who: "AI", mine: false },
    { label: "I check it against real records", who: "Eva", mine: true },
    { label: "It ships", who: "Live", mine: false },
  ],
  howNote: "About $300 a month in AI tools, no developer.",
  beforeAI: [
    "Taught myself SharePoint + Power Automate at Mino: missed invoices down ~50%",
    "Computer Science minor",
    "SQL · R · Python · Excel macros",
  ],
};

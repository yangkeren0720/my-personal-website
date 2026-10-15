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
  roles: ["live dashboards", "data visualization", "clean, reconciled data"],
  tagline:
    "Material Planner at SkyWater, keeping a wafer fab supplied with critical materials. Before that, purchasing and capacity planning for EV line build-outs at Mino Automation. Outside SkyWater, I manage five departments at Belong and co-own a property business I automated with AI.",
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
    title: "Manager",
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
    place: "Side business",
    summary: "Co-own a student-housing business; built its systems, dashboards and AI tools with Claude Code and Codex, each cross-checking the other.",
    highlights: [],
    links: [
      { label: "RBR platform", href: "#work" },
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
    "I'm not a programmer. I build with Claude Code and Codex, have each one cross-check the other's work, then check everything against real records. About $300 a month.",
};

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
  ],
};

export const skills = [
  "Material Planning", "S&OP / SIOP", "MRP & ERP", "Safety Stock & Min/Max", "Demand Forecasting",
  "Supplier Management", "Strategic Sourcing", "Capacity Planning", "Purchasing & POs",
  "Shortage Risk Dashboards", "Data Visualization", "Power Automate & SharePoint",
  "SQL", "Advanced Excel", "AI Integration", "Lean / Six Sigma", "English & 中文",
];

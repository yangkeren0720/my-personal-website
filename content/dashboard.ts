// Sample data for the live dashboard demo. Shaped like the dashboards built at
// RBR (occupancy, open rooms per house, application pipeline, AI cost), but
// every number here is made up: no real tenant or business data.

export type Term = "Fall 2026" | "Spring 2027" | "Summer 2027";
export const terms: Term[] = ["Fall 2026", "Spring 2027", "Summer 2027"];

export const houses = ["Maple", "Cedar", "Oak", "Willow", "Birch", "Aspen"];
const roomsPerHouse = [8, 6, 10, 7, 9, 5];

type TermData = {
  occupancyByWeek: number[]; // percent, 12 weeks
  openRooms: number[]; // per house
  pipeline: { stage: string; count: number }[];
  aiCostByDay: number[]; // dollars, 30 days
  daysToSign: number;
};

export const data: Record<Term, TermData> = {
  "Fall 2026": {
    occupancyByWeek: [71, 74, 78, 81, 85, 88, 90, 92, 94, 95, 96, 97],
    openRooms: [0, 1, 0, 0, 1, 0],
    pipeline: [
      { stage: "Interest forms", count: 214 },
      { stage: "Applications", count: 126 },
      { stage: "Approved", count: 71 },
      { stage: "Leases signed", count: 43 },
    ],
    aiCostByDay: [2.1, 2.4, 1.8, 3.2, 2.9, 1.2, 0.9, 2.6, 3.1, 3.4, 2.8, 2.2, 1.1, 0.8, 2.9, 3.6, 3.9, 3.3, 2.7, 1.4, 1.0, 3.1, 3.5, 2.9, 2.6, 2.4, 1.3, 0.9, 2.8, 3.2],
    daysToSign: 4.2,
  },
  "Spring 2027": {
    occupancyByWeek: [52, 55, 57, 61, 64, 66, 70, 73, 75, 78, 80, 83],
    openRooms: [2, 1, 5, 2, 3, 1],
    pipeline: [
      { stage: "Interest forms", count: 168 },
      { stage: "Applications", count: 92 },
      { stage: "Approved", count: 48 },
      { stage: "Leases signed", count: 27 },
    ],
    aiCostByDay: [1.6, 1.9, 2.2, 2.5, 2.1, 0.9, 0.7, 2.3, 2.6, 2.9, 2.4, 2.0, 1.0, 0.6, 2.4, 2.8, 3.0, 2.7, 2.2, 1.1, 0.8, 2.5, 2.7, 2.4, 2.1, 1.9, 1.0, 0.7, 2.2, 2.6],
    daysToSign: 3.6,
  },
  "Summer 2027": {
    occupancyByWeek: [30, 32, 33, 36, 38, 41, 43, 44, 47, 49, 52, 54],
    openRooms: [4, 3, 6, 4, 5, 2],
    pipeline: [
      { stage: "Interest forms", count: 97 },
      { stage: "Applications", count: 51 },
      { stage: "Approved", count: 26 },
      { stage: "Leases signed", count: 14 },
    ],
    aiCostByDay: [0.9, 1.1, 1.3, 1.2, 1.0, 0.5, 0.4, 1.2, 1.4, 1.5, 1.3, 1.1, 0.6, 0.4, 1.3, 1.6, 1.7, 1.5, 1.2, 0.6, 0.5, 1.4, 1.5, 1.3, 1.2, 1.1, 0.6, 0.4, 1.2, 1.4],
    daysToSign: 3.1,
  },
};

export const totalRooms = roomsPerHouse.reduce((a, b) => a + b, 0);

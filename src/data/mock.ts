/**
 * Phase 1 mock data layer.
 * Kept isolated from UI so Phase 2 can swap these for Supabase queries.
 */
import type { EventCategory, ResourceType } from "@/lib/constants";

export interface MockStudent {
  fullName: string;
  registrationNumber: string;
  department: string;
  year: string;
  semester: string;
}

export interface MockEvent {
  id: string;
  title: string;
  category: EventCategory;
  venue: string;
  date: string;
  registrationDeadline: string;
}

export interface MockResource {
  id: string;
  title: string;
  subject: string;
  type: ResourceType;
  uploadedBy: string;
  downloads: number;
}

export const mockStudent: MockStudent = {
  fullName: "Student",
  registrationNumber: "811722104045",
  department: "CSE",
  year: "3rd Year",
  semester: "Semester 5",
};

export const mockUpcomingEvents: MockEvent[] = [
  {
    id: "e1",
    title: "KRCT Hack 48",
    category: "Hackathon",
    venue: "Main Auditorium",
    date: "Fri, 21 Aug · 9:00 AM",
    registrationDeadline: "in 2 days",
  },
  {
    id: "e2",
    title: "AI & Cloud Workshop",
    category: "Workshop",
    venue: "CSE Seminar Hall",
    date: "Mon, 24 Aug · 2:00 PM",
    registrationDeadline: "in 5 days",
  },
  {
    id: "e3",
    title: "Kalaivizhi Cultural Night",
    category: "Cultural",
    venue: "Open Air Theatre",
    date: "Sat, 29 Aug · 6:00 PM",
    registrationDeadline: "in 9 days",
  },
];

export const mockRecentResources: MockResource[] = [
  {
    id: "r1",
    title: "Operating Systems — Unit 3 Notes",
    subject: "Operating Systems",
    type: "Notes",
    uploadedBy: "Aravind K.",
    downloads: 128,
  },
  {
    id: "r2",
    title: "Database Systems PYQ 2023",
    subject: "DBMS",
    type: "PYQs",
    uploadedBy: "Divya R.",
    downloads: 96,
  },
  {
    id: "r3",
    title: "Data Structures Crash Course",
    subject: "Data Structures",
    type: "Videos",
    uploadedBy: "Karthik S.",
    downloads: 74,
  },
];

export const mockUnreadMessageCount = 3;

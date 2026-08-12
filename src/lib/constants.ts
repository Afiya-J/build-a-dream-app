export const APP_NAME = "CampusLife";
export const APP_TAGLINE = "Your campus, organized.";
export const COLLEGE_NAME = "K. Ramakrishnan College of Technology";
export const COLLEGE_SHORT_NAME = "KRCT";

export const DEPARTMENTS = ["CSE", "ECE", "EEE", "Mechanical", "Civil"] as const;

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;

export const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
] as const;

export const RESOURCE_TYPES = ["Notes", "PYQs", "Videos", "Websites"] as const;

export const EVENT_CATEGORIES = [
  "Workshop",
  "Hackathon",
  "Competition",
  "Cultural",
  "Seminar",
  "Other",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type Year = (typeof YEARS)[number];
export type Semester = (typeof SEMESTERS)[number];
export type ResourceType = (typeof RESOURCE_TYPES)[number];
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

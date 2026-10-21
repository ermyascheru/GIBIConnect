export const EVENT_CATEGORIES = [
  "DEADLINE",
  "CONFERENCE",
  "ORIENTATION",
  "HACKATHON",
  "CAREER",
  "WORKSHOP",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface AcademicEvent {
  id: string;
  institutionId: string | null;
  institutionCode: string | null;
  institutionName: string | null;
  title: string;
  category: EventCategory;
  dateGregorian: string;
  dateEthiopic: string;
  time: string | null;
  location: string;
  isVirtual: boolean;
  image: string | null;
  description: string;
  registrationOpen: boolean;
  attendeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventQuery {
  category?: EventCategory | "ALL";
  institutionId?: string;
  isVirtual?: boolean;
  search?: string;
}

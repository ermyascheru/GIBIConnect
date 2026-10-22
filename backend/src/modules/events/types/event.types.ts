export interface AcademicEvent {
  id: string;
  institutionId?: string | null;
  institutionCode?: string | null;
  institutionName?: string | null;
  title: string;
  category: 'DEADLINE' | 'CONFERENCE' | 'ORIENTATION' | 'HACKATHON' | 'CAREER' | 'WORKSHOP';
  dateGregorian: string;
  dateEthiopic: string;
  time?: string | null;
  location: string;
  isVirtual: boolean;
  image?: string | null;
  description: string;
  registrationOpen: boolean;
  attendeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventQuery {
  category?: string;
  institutionId?: string;
  isVirtual?: boolean;
  search?: string;
}

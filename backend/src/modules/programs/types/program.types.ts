export interface Program {
  id: string;
  institution_id: string | null;
  department_id: string | null;
  name: string;
  slug: string;
  degree_level: string | null;
  duration: string | null;
  study_mode: string | null;
  description: string | null;
  admission_requirements: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  institution_name: string | null;
  department_name: string | null;
}

export interface ProgramQuery {
  institutionId?: string;
  departmentId?: string;
  degreeLevel?: string;
  studyMode?: string;
  status?: string;
  search?: string;
}

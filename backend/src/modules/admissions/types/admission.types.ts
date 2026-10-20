export interface Admission {
  id: string;
  institution_id: string | null;
  program_id: string | null;
  degree_level: string | null;
  requirements: string | null;
  documents: string | null;
  application_process: string | null;
  application_start: string | null;
  application_end: string | null;
  application_url: string | null;
  created_at: string;
  updated_at: string;
  institution_name: string | null;
  program_name: string | null;
}

export interface AdmissionQuery {
  institutionId?: string;
  programId?: string;
  degreeLevel?: string;
  search?: string;
}

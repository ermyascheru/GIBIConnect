export interface Resource {
  id: string;
  title: string;
  description: string | null;
  resource_type: string | null;
  mime_type: string | null;
  file_extension: string | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  storage_provider: string | null;
  storage_bucket: string | null;
  storage_key: string | null;
  checksum: string | null;
  uploaded_by: string | null;
  institution_id: string | null;
  faculty_id: string | null;
  department_id: string | null;
  program_id: string | null;
  publication_year: number | null;
  language: string | null;
  status: string | null;
  visibility: string | null;
  extracted_text: string | null;
  transcript: string | null;
  processing_status: string | null;
  processing_error: string | null;
  created_at: string;
  updated_at: string;
  institution_name: string | null;
  faculty_name: string | null;
  department_name: string | null;
  program_name: string | null;
}

export interface ResourceQuery {
  institutionId?: string;
  programId?: string;
  facultyId?: string;
  departmentId?: string;
  resourceType?: string;
  status?: string;
  visibility?: string;
  search?: string;
}

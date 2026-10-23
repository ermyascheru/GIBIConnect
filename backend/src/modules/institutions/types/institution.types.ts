export interface Institution {
  id: string;
  name: string;
  slug?: string | null;
  region: string | null;
  city?: string | null;
  address?: string | null;
  ownership: string | null;
  type: string | null;
  status: string | null;
  description?: string | null;
  history?: string | null;
  website_url?: string | null;
  email?: string | null;
  phone?: string | null;
  total_faculties?: number;
  total_departments?: number;
  total_programs?: number;
}

export interface InstitutionQuery {
  region?: string;
  ownership?: string;
  type?: string;
  search?: string;
}
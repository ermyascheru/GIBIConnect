export interface Institution {
  id: string;
  name: string;
  region: string | null;
  ownership: string | null;
  type: string | null;
  status: string | null;
}

export interface InstitutionQuery {
  region?: string;
  ownership?: string;
  type?: string;
  search?: string;
}
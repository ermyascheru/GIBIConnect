export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserQuery {
  role?: string;
  status?: string;
  search?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: string;
  status: string;
}

export interface AuthenticatedUserSummary {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
}

export interface LoginResult {
  token: string;
  user: AuthenticatedUserSummary;
}

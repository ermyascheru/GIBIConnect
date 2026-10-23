import pool from "../../../config/database";
import type { AuthUser } from "../types/auth.types";

export const findUserByEmail = async (
  email: string
): Promise<AuthUser | null> => {
  const result = await pool.query<AuthUser>(
    `SELECT
      id::text AS id,
      email,
      full_name,
      password_hash,
      role::text AS role,
      status::text AS status
    FROM public.users
    WHERE email = $1
    LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
};

export const createUser = async (
  email: string,
  passwordHash: string,
  fullName: string
): Promise<AuthUser> => {
  const result = await pool.query<AuthUser>(
    `INSERT INTO public.users (email, password_hash, full_name, role, status)
     VALUES ($1, $2, $3, 'user', 'active')
     RETURNING
       id::text AS id,
       email,
       full_name,
       password_hash,
       role::text AS role,
       status::text AS status`,
    [email, passwordHash, fullName]
  );

  return result.rows[0];
};

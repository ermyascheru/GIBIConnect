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

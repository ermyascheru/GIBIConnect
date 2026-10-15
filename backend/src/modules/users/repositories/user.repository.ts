import pool from "../../../config/database";
import type { UserProfile, UserQuery } from "../types/user.types";

const userSelect = `
  SELECT
    id::text AS id,
    email,
    full_name,
    role::text AS role,
    status::text AS status,
    created_at,
    updated_at
  FROM public.users
`;

export const findAllUsers = async (
  query: UserQuery
): Promise<UserProfile[]> => {
  const result = await pool.query<UserProfile>(
    `${userSelect}
    WHERE ($1::user_role IS NULL OR role = $1)
      AND ($2::user_status IS NULL OR status = $2)
      AND (
        $3::text IS NULL
        OR email ILIKE '%' || $3 || '%'
        OR full_name ILIKE '%' || $3 || '%'
      )
    ORDER BY full_name ASC`,
    [
      query.role ?? null,
      query.status ?? null,
      query.search ?? null,
    ]
  );

  return result.rows;
};

export const findUserById = async (
  id: string
): Promise<UserProfile | null> => {
  const result = await pool.query<UserProfile>(
    `${userSelect}
    WHERE id = $1::uuid`,
    [id]
  );

  return result.rows[0] ?? null;
};

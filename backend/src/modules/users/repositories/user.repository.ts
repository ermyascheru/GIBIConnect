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

export const getUserBookmarks = async (
  userId: string
): Promise<{ institutions: string[]; resources: string[] }> => {
  const [instRes, rsrcRes] = await Promise.all([
    pool.query<{ institution_id: string }>(
      `SELECT institution_id::text FROM public.saved_institutions WHERE user_id = $1::uuid`,
      [userId]
    ),
    pool.query<{ resource_id: string }>(
      `SELECT resource_id::text FROM public.resource_bookmarks WHERE user_id = $1::uuid`,
      [userId]
    ),
  ]);

  return {
    institutions: instRes.rows.map((r) => r.institution_id),
    resources: rsrcRes.rows.map((r) => r.resource_id),
  };
};

export const addInstitutionBookmark = async (
  userId: string,
  institutionId: string
): Promise<void> => {
  await pool.query(
    `INSERT INTO public.saved_institutions (user_id, institution_id, created_at)
     VALUES ($1::uuid, $2::uuid, NOW())
     ON CONFLICT DO NOTHING`,
    [userId, institutionId]
  );
};

export const removeInstitutionBookmark = async (
  userId: string,
  institutionId: string
): Promise<void> => {
  await pool.query(
    `DELETE FROM public.saved_institutions
     WHERE user_id = $1::uuid AND institution_id = $2::uuid`,
    [userId, institutionId]
  );
};

export const addResourceBookmark = async (
  userId: string,
  resourceId: string
): Promise<void> => {
  await pool.query(
    `INSERT INTO public.resource_bookmarks (user_id, resource_id, created_at)
     VALUES ($1::uuid, $2::uuid, NOW())
     ON CONFLICT DO NOTHING`,
    [userId, resourceId]
  );
};

export const removeResourceBookmark = async (
  userId: string,
  resourceId: string
): Promise<void> => {
  await pool.query(
    `DELETE FROM public.resource_bookmarks
     WHERE user_id = $1::uuid AND resource_id = $2::uuid`,
    [userId, resourceId]
  );
};

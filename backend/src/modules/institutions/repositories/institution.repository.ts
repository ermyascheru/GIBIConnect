import { Institution, InstitutionQuery } from "../types/institution.types";
import pool from "../../../config/database";

const institutionSelect = `
  SELECT
    id::text AS id,
    name,
    region,
    ownership::text AS ownership,
    type::text AS type,
    status::text AS status
  FROM public.institutions
`;

export const findAllInstitutions = async (
  query: InstitutionQuery
): Promise<Institution[]> => {
  const result = await pool.query<Institution>(
    `${institutionSelect}
    WHERE status = 'published'::institution_status
      AND ($1::text IS NULL OR region = $1)
      AND ($2::text IS NULL OR ownership::text = $2)
      AND ($3::text IS NULL OR type::text = $3)
      AND (
        $4::text IS NULL
        OR name ILIKE '%' || $4 || '%'
        OR slug ILIKE '%' || $4 || '%'
      )
    ORDER BY name ASC`,
    [
      query.region || null,
      query.ownership || null,
      query.type || null,
      query.search || null,
    ]
  );

  return result.rows;
};

export const findInstitutionById = async (
  id: string
): Promise<Institution | null> => {
  const result = await pool.query<Institution>(
    `${institutionSelect}
    WHERE id = $1::uuid
      AND status = 'published'::institution_status`,
    [id]
  );

  return result.rows[0] ?? null;
};
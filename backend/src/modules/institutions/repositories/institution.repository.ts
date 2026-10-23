import { Institution, InstitutionQuery } from "../types/institution.types";
import pool from "../../../config/database";

const institutionSelect = `
  SELECT
    i.id::text AS id,
    i.name,
    i.slug,
    i.region,
    i.city,
    i.address,
    i.ownership::text AS ownership,
    i.type::text AS type,
    i.status::text AS status,
    i.description,
    i.history,
    i.website_url,
    i.email,
    i.phone,
    (SELECT COUNT(*)::int FROM public.faculties f WHERE f.institution_id = i.id) AS total_faculties,
    (SELECT COUNT(*)::int FROM public.departments d JOIN public.faculties f ON d.faculty_id = f.id WHERE f.institution_id = i.id) AS total_departments,
    (SELECT COUNT(*)::int FROM public.programs p WHERE p.institution_id = i.id) AS total_programs
  FROM public.institutions i
`;

export const findAllInstitutions = async (
  query: InstitutionQuery
): Promise<Institution[]> => {
  const result = await pool.query<Institution>(
    `${institutionSelect}
    WHERE i.status = 'published'::institution_status
      AND ($1::text IS NULL OR i.region = $1)
      AND ($2::text IS NULL OR i.ownership::text = $2)
      AND ($3::text IS NULL OR i.type::text = $3)
      AND (
        $4::text IS NULL
        OR i.name ILIKE '%' || $4 || '%'
        OR i.slug ILIKE '%' || $4 || '%'
      )
    ORDER BY i.name ASC`,
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
    WHERE i.id = $1::uuid
      AND i.status = 'published'::institution_status`,
    [id]
  );

  return result.rows[0] ?? null;
};
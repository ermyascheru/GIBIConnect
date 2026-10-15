import pool from "../../../config/database";
import type { Program, ProgramQuery } from "../types/program.types";

const programSelect = `
  SELECT
    p.id::text AS id,
    p.institution_id::text AS institution_id,
    p.department_id::text AS department_id,
    p.name,
    p.slug,
    p.degree_level::text AS degree_level,
    p.duration,
    p.study_mode::text AS study_mode,
    p.description,
    p.admission_requirements,
    p.status::text AS status,
    i.name AS institution_name,
    d.name AS department_name,
    p.created_at,
    p.updated_at
  FROM public.programs p
  LEFT JOIN public.institutions i ON i.id = p.institution_id
  LEFT JOIN public.departments d ON d.id = p.department_id
`;

export const findAllPrograms = async (
  query: ProgramQuery
): Promise<Program[]> => {
  const result = await pool.query<Program>(
    `${programSelect}
    WHERE p.status = COALESCE($1::institution_status, 'published'::institution_status)
      AND ($2::uuid IS NULL OR p.institution_id = $2)
      AND ($3::uuid IS NULL OR p.department_id = $3)
      AND ($4::degree_level IS NULL OR p.degree_level = $4)
      AND ($5::study_mode IS NULL OR p.study_mode = $5)
      AND (
        $6::text IS NULL
        OR p.name ILIKE '%' || $6 || '%'
        OR p.slug ILIKE '%' || $6 || '%'
      )
    ORDER BY p.name ASC`,
    [
      query.status ?? null,
      query.institutionId ?? null,
      query.departmentId ?? null,
      query.degreeLevel ?? null,
      query.studyMode ?? null,
      query.search ?? null,
    ]
  );

  return result.rows;
};

export const findProgramById = async (
  id: string
): Promise<Program | null> => {
  const result = await pool.query<Program>(
    `${programSelect}
    WHERE p.id = $1::uuid
      AND p.status = 'published'::institution_status`,
    [id]
  );

  return result.rows[0] ?? null;
};

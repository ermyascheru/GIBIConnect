import pool from "../../../config/database";
import type { Admission, AdmissionQuery } from "../types/admission.types";

const admissionSelect = `
  SELECT
    a.id::text AS id,
    a.institution_id::text AS institution_id,
    a.program_id::text AS program_id,
    a.degree_level::text AS degree_level,
    a.requirements,
    a.documents,
    a.application_process,
    a.application_start,
    a.application_end,
    a.application_url,
    i.name AS institution_name,
    p.name AS program_name,
    a.created_at,
    a.updated_at
  FROM public.admissions a
  LEFT JOIN public.institutions i ON i.id = a.institution_id
  LEFT JOIN public.programs p ON p.id = a.program_id
`;

export const findAllAdmissions = async (
  query: AdmissionQuery
): Promise<Admission[]> => {
  const result = await pool.query<Admission>(
    `${admissionSelect}
    WHERE ($1::uuid IS NULL OR a.institution_id = $1)
      AND ($2::uuid IS NULL OR a.program_id = $2)
      AND ($3::degree_level IS NULL OR a.degree_level = $3)
      AND (
        $4::text IS NULL
        OR i.name ILIKE '%' || $4 || '%'
        OR p.name ILIKE '%' || $4 || '%'
        OR a.requirements ILIKE '%' || $4 || '%'
      )
    ORDER BY a.application_start DESC NULLS LAST`,
    [
      query.institutionId ?? null,
      query.programId ?? null,
      query.degreeLevel ?? null,
      query.search ?? null,
    ]
  );

  return result.rows;
};

export const findAdmissionById = async (
  id: string
): Promise<Admission | null> => {
  const result = await pool.query<Admission>(
    `${admissionSelect}
    WHERE a.id = $1::uuid`,
    [id]
  );

  return result.rows[0] ?? null;
};

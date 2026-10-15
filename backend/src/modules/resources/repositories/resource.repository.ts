import pool from "../../../config/database";
import type { Resource, ResourceQuery } from "../types/resource.types";

const resourceSelect = `
  SELECT
    r.id::text AS id,
    r.title,
    r.description,
    r.resource_type::text AS resource_type,
    r.mime_type,
    r.file_extension,
    r.original_filename,
    r.file_size_bytes,
    r.storage_provider,
    r.storage_bucket,
    r.storage_key,
    r.checksum,
    r.uploaded_by::text AS uploaded_by,
    r.institution_id::text AS institution_id,
    r.faculty_id::text AS faculty_id,
    r.department_id::text AS department_id,
    r.program_id::text AS program_id,
    r.publication_year,
    r.language,
    r.status::text AS status,
    r.visibility::text AS visibility,
    r.extracted_text,
    r.transcript,
    r.processing_status::text AS processing_status,
    r.processing_error,
    r.created_at,
    r.updated_at,
    i.name AS institution_name,
    f.name AS faculty_name,
    d.name AS department_name,
    p.name AS program_name
  FROM public.resources r
  LEFT JOIN public.institutions i ON i.id = r.institution_id
  LEFT JOIN public.faculties f ON f.id = r.faculty_id
  LEFT JOIN public.departments d ON d.id = r.department_id
  LEFT JOIN public.programs p ON p.id = r.program_id
`;

export const findAllResources = async (
  query: ResourceQuery
): Promise<Resource[]> => {
  const result = await pool.query<Resource>(
    `${resourceSelect}
    WHERE ($1::uuid IS NULL OR r.institution_id = $1)
      AND ($2::uuid IS NULL OR r.program_id = $2)
      AND ($3::uuid IS NULL OR r.faculty_id = $3)
      AND ($4::uuid IS NULL OR r.department_id = $4)
      AND ($5::resource_type IS NULL OR r.resource_type = $5)
      AND ($6::resource_status IS NULL OR r.status = $6)
      AND ($7::resource_visibility IS NULL OR r.visibility = $7)
      AND (
        $8::text IS NULL
        OR r.title ILIKE '%' || $8 || '%'
        OR r.description ILIKE '%' || $8 || '%'
        OR p.name ILIKE '%' || $8 || '%'
      )
    ORDER BY r.created_at DESC`,
    [
      query.institutionId ?? null,
      query.programId ?? null,
      query.facultyId ?? null,
      query.departmentId ?? null,
      query.resourceType ?? null,
      query.status ?? null,
      query.visibility ?? null,
      query.search ?? null,
    ]
  );

  return result.rows;
};

export const findResourceById = async (
  id: string
): Promise<Resource | null> => {
  const result = await pool.query<Resource>(
    `${resourceSelect}
    WHERE r.id = $1::uuid`,
    [id]
  );

  return result.rows[0] ?? null;
};

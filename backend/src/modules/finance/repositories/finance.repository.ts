import pool from "../../../config/database";
import type { TuitionFee, TuitionFeeQuery } from "../types/finance.types";

const tuitionFeeSelect = `
  SELECT
    tf.id::text AS id,
    tf.institution_id::text AS institution_id,
    tf.program_id::text AS program_id,
    tf.amount,
    tf.currency,
    tf.period::text AS period,
    tf.additional_fees,
    tf.effective_date,
    tf.last_verified_at,
    tf.source,
    i.name AS institution_name,
    p.name AS program_name
  FROM public.tuition_fees tf
  LEFT JOIN public.institutions i ON i.id = tf.institution_id
  LEFT JOIN public.programs p ON p.id = tf.program_id
`;

export const findAllTuitionFees = async (
  query: TuitionFeeQuery
): Promise<TuitionFee[]> => {
  const result = await pool.query<TuitionFee>(
    `${tuitionFeeSelect}
    WHERE ($1::uuid IS NULL OR tf.institution_id = $1)
      AND ($2::uuid IS NULL OR tf.program_id = $2)
      AND ($3::text IS NULL OR tf.currency = $3)
      AND (
        $4::text IS NULL
        OR i.name ILIKE '%' || $4 || '%'
        OR p.name ILIKE '%' || $4 || '%'
        OR tf.source ILIKE '%' || $4 || '%'
      )
    ORDER BY tf.effective_date DESC NULLS LAST`,
    [
      query.institutionId ?? null,
      query.programId ?? null,
      query.currency ?? null,
      query.search ?? null,
    ]
  );

  return result.rows;
};

export const findTuitionFeeById = async (
  id: string
): Promise<TuitionFee | null> => {
  const result = await pool.query<TuitionFee>(
    `${tuitionFeeSelect}
    WHERE tf.id = $1::uuid`,
    [id]
  );

  return result.rows[0] ?? null;
};

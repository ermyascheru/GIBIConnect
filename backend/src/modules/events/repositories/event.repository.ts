import pool from "../../../config/database";
import type { AcademicEvent, EventQuery } from "../types/event.types";

const selectEvents = `
  SELECT
    e.id::text AS id,
    e."institutionId"::text AS "institutionId",
    i.code AS "institutionCode",
    i."nameEn" AS "institutionName",
    e.title,
    e.category::text AS category,
    e."dateGregorian",
    e."dateEthiopic",
    e.time,
    e.location,
    e."isVirtual",
    e.image,
    e.description,
    e."registrationOpen",
    e."attendeesCount",
    e."createdAt",
    e."updatedAt"
  FROM "AcademicEvent" e
  LEFT JOIN "Institution" i ON i.id = e."institutionId"
`;

export const findEvents = async (
  query: EventQuery
): Promise<AcademicEvent[]> => {
  const conditions: string[] = [];
  const values: unknown[] = [];

  const add = (condition: (parameter: string) => string, value: unknown) => {
    values.push(value);
    conditions.push(condition(`$${values.length}`));
  };

  if (query.category && query.category !== "ALL") {
    add((p) => `e.category::text = ${p}`, query.category);
  }

  if (query.institutionId) {
    add((p) => `e."institutionId"::text = ${p}`, query.institutionId);
  }

  if (query.isVirtual !== undefined) {
    add((p) => `e."isVirtual" = ${p}`, query.isVirtual);
  }

  if (query.search) {
    add(
      (p) => `(e.title ILIKE ${p} OR e.description ILIKE ${p} OR e.location ILIKE ${p})`,
      `%${query.search}%`
    );
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query<AcademicEvent>(
    `${selectEvents} ${where} ORDER BY e."createdAt" DESC`,
    values
  );

  return result.rows;
};

export const findEventById = async (
  id: string
): Promise<AcademicEvent | null> => {
  const result = await pool.query<AcademicEvent>(
    `${selectEvents} WHERE e.id::text = $1 LIMIT 1`,
    [id]
  );

  return result.rows[0] ?? null;
};

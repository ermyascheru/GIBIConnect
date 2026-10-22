import pool from "../../../config/database";
import { Tutor, TutorBooking, TutorQuery, BookingStatus } from "../types/marketplace.types";

const tutorSql = `
SELECT tp.id::text AS id, tp.user_id::text AS "userId", u.full_name AS name, u.email,
 i.name AS "universityName", tp.specialty_subjects AS "specialtySubjects",
 tp.rating_average::float8 AS "ratingAverage", tp.reviews_count AS "reviewsCount",
 tp.hourly_rate_etb::float8 AS "hourlyRateEtb", tp.is_verified AS "isVerified",
 tp.bio, tp.avatar_url AS "avatarUrl"
FROM public.tutor_profiles tp
JOIN public.users u ON u.id = tp.user_id
LEFT JOIN public.institutions i ON i.id = tp.institution_id`;

export async function findTutors(q: TutorQuery): Promise<Tutor[]> {
  const where: string[] = []; const values: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    values.push(value); where.push(sql.replace("?", `$${values.length}`));
  };
  if (q.universityId) add("tp.institution_id = ?::uuid", q.universityId);
  if (q.specialty) add("? = ANY(tp.specialty_subjects)", q.specialty);
  if (q.verified !== undefined) add("tp.is_verified = ?", q.verified);
  if (q.maxHourlyRate !== undefined) add("tp.hourly_rate_etb <= ?", q.maxHourlyRate);
  if (q.minRating !== undefined) add("tp.rating_average >= ?", q.minRating);
  if (q.search) {
    values.push(`%${q.search}%`);
    where.push(`(u.full_name ILIKE $${values.length} OR tp.bio ILIKE $${values.length} OR EXISTS (SELECT 1 FROM unnest(tp.specialty_subjects) s WHERE s ILIKE $${values.length}))`);
  }
  const result = await pool.query<Tutor>(
    `${tutorSql} ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY tp.rating_average DESC, u.full_name`,
    values
  );
  return result.rows;
}
export async function findTutorById(id: string): Promise<Tutor | null> {
  const r = await pool.query<Tutor>(`${tutorSql} WHERE tp.id = $1::uuid`, [id]);
  return r.rows[0] ?? null;
}

const bookingSql = `
SELECT b.id::text AS id, b.tutor_id::text AS "tutorId", u.full_name AS "tutorName",
 b.student_name AS "studentName", b.student_email AS "studentEmail", b.subject,
 b.session_date::text AS "sessionDate", b.time_slot AS "timeSlot",
 b.duration_hours::float8 AS "durationHours", b.total_price_etb::float8 AS "totalPriceEtb",
 b.notes, b.status::text AS status, b.created_at::text AS "createdAt", b.updated_at::text AS "updatedAt"
FROM public.tutor_bookings b
JOIN public.tutor_profiles tp ON tp.id = b.tutor_id
JOIN public.users u ON u.id = tp.user_id`;
type NewBooking = { tutorId: string; studentName: string; studentEmail: string; subject: string; sessionDate: string; timeSlot: string; durationHours: number; notes?: string };

export async function createBooking(v: NewBooking): Promise<TutorBooking> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const t = await client.query<{ rate: number }>(
      "SELECT hourly_rate_etb::float8 AS rate FROM public.tutor_profiles WHERE id=$1::uuid", [v.tutorId]);
    if (!t.rows[0]) {
      const e = Object.assign(new Error("Tutor not found"), { statusCode: 404, code: "TUTOR_NOT_FOUND" });
      throw e;
    }
    const ins = await client.query<{ id: string }>(`
      INSERT INTO public.tutor_bookings
      (tutor_id, student_name, student_email, subject, session_date, time_slot, duration_hours, total_price_etb, notes, status)
      VALUES ($1::uuid,$2,$3,$4,$5::date,$6,$7,$8,$9,'REQUESTED') RETURNING id::text AS id`,
      [v.tutorId,v.studentName,v.studentEmail,v.subject,v.sessionDate,v.timeSlot,v.durationHours,Number(t.rows[0].rate)*v.durationHours,v.notes ?? null]);
    const result = await client.query<TutorBooking>(`${bookingSql} WHERE b.id=$1::uuid`, [ins.rows[0].id]);
    await client.query("COMMIT"); return result.rows[0];
  } catch (e) { try { await client.query("ROLLBACK"); } catch {} throw e; }
  finally { client.release(); }
}
export async function findBookings(email?: string, tutorId?: string): Promise<TutorBooking[]> {
  const where: string[] = []; const values: unknown[] = [];
  if (email) { values.push(email); where.push(`b.student_email=$${values.length}`); }
  if (tutorId) { values.push(tutorId); where.push(`b.tutor_id=$${values.length}::uuid`); }
  const r = await pool.query<TutorBooking>(`${bookingSql} WHERE ${where.join(" AND ")} ORDER BY b.created_at DESC`, values);
  return r.rows;
}
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<TutorBooking | null> {
  const u = await pool.query("UPDATE public.tutor_bookings SET status=$2, updated_at=NOW() WHERE id=$1::uuid RETURNING id", [id,status]);
  if (!u.rowCount) return null;
  const r = await pool.query<TutorBooking>(`${bookingSql} WHERE b.id=$1::uuid`, [id]);
  return r.rows[0] ?? null;
}

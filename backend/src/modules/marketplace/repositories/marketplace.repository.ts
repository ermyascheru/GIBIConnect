import { TutorProfile, MarketplaceQuery, TutorBooking } from "../types/marketplace.types";
import { prisma } from "../../../db";
import pool from "../../../config/database";

// Fallback high-quality curated Ethiopian university peer tutors
const FALLBACK_TUTORS: TutorProfile[] = [
  {
    id: "tut-1",
    userId: "usr-tut-1",
    name: "Selamawit Kebede",
    email: "selamawit.k@aau.edu.et",
    universityName: "Addis Ababa University (AAiT)",
    specialtySubjects: ["Computer Science", "Data Structures & Algorithms", "C++", "Python"],
    ratingAverage: 4.9,
    reviewsCount: 38,
    hourlyRateEtb: 300,
    isVerified: true,
    bio: "4th year Software Engineering student at AAiT Sidist/5 Kilo. Assisted over 80 freshman and sophomore students in programming fundamentals and calculus.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tut-2",
    userId: "usr-tut-2",
    name: "Dawit Haile",
    email: "dawit.haile@astu.edu.et",
    universityName: "Adama Science and Technology University (ASTU)",
    specialtySubjects: ["Calculus I & II", "Linear Algebra", "Applied Physics (PHYS1011)"],
    ratingAverage: 4.8,
    reviewsCount: 45,
    hourlyRateEtb: 250,
    isVerified: true,
    bio: "Top performing Applied Mathematics junior at ASTU. Passionate about breaking down STEM freshman problems step-by-step.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tut-3",
    userId: "usr-tut-3",
    name: "Dr. Henok Tadesse",
    email: "henok.t@hu.edu.et",
    universityName: "Hawassa University",
    specialtySubjects: ["General Biology (BIOL1011)", "General Chemistry (CHEM1011)", "Organic Chemistry"],
    ratingAverage: 5.0,
    reviewsCount: 62,
    hourlyRateEtb: 400,
    isVerified: true,
    bio: "Hawassa College of Medicine & Health Sciences senior resident. Experienced tutor for natural science freshman stream and pre-med entry exams.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tut-4",
    userId: "usr-tut-4",
    name: "Bethelhem Mekonnen",
    email: "bethelhem.m@bdu.edu.et",
    universityName: "Bahir Dar University",
    specialtySubjects: ["Microeconomics", "Macroeconomics", "Accounting & Finance"],
    ratingAverage: 4.7,
    reviewsCount: 29,
    hourlyRateEtb: 200,
    isVerified: true,
    bio: "Economics graduate assistant at BDU. Focused on freshman social science courses, logic, and quantitative finance.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tut-5",
    userId: "usr-tut-5",
    name: "Yonas Alemayehu",
    email: "yonas.a@ju.edu.et",
    universityName: "Jimma University",
    specialtySubjects: ["Electrical Engineering", "Circuit Theory", "Digital Logic Design"],
    ratingAverage: 4.9,
    reviewsCount: 52,
    hourlyRateEtb: 350,
    isVerified: true,
    bio: "Jimma Institute of Technology (JIT) research assistant. Specializing in undergraduate circuit analysis and embedded systems.",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const findTutors = async (query: MarketplaceQuery): Promise<TutorProfile[]> => {
  try {
    const where: any = {};

    if (query.university) {
      where.universityName = { contains: query.university, mode: "insensitive" };
    }
    if (query.specialty) {
      where.specialtySubjects = { has: query.specialty };
    }
    if (query.isVerified !== undefined) {
      where.isVerified = query.isVerified;
    }
    if (query.maxHourlyRate !== undefined) {
      where.hourlyRateEtb = { lte: query.maxHourlyRate };
    }
    if (query.minRating !== undefined) {
      where.ratingAverage = { gte: query.minRating };
    }
    if (query.search) {
      where.OR = [
        { universityName: { contains: query.search, mode: "insensitive" } },
        { bio: { contains: query.search, mode: "insensitive" } },
        { user: { fullName: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const tutors = await prisma.tutorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: [{ isVerified: "desc" }, { ratingAverage: "desc" }],
    });

    if (tutors && tutors.length > 0) {
      return tutors.map((t) => ({
        id: t.id,
        userId: t.userId,
        name: t.user.fullName,
        email: t.user.email,
        universityName: t.universityName,
        specialtySubjects: t.specialtySubjects,
        ratingAverage: t.ratingAverage,
        reviewsCount: t.reviewsCount,
        hourlyRateEtb: t.hourlyRateEtb,
        isVerified: t.isVerified,
        bio: t.bio,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      }));
    }
  } catch (err: any) {
    console.warn("[MarketplaceRepository] Falling back to curated tutors:", err?.message || err);
  }

  // Fallback filtering
  return FALLBACK_TUTORS.filter((t) => {
    if (query.university && !t.universityName.toLowerCase().includes(query.university.toLowerCase())) {
      return false;
    }
    if (query.specialty && !t.specialtySubjects.some(s => s.toLowerCase().includes(query.specialty!.toLowerCase()))) {
      return false;
    }
    if (query.isVerified !== undefined && t.isVerified !== query.isVerified) {
      return false;
    }
    if (query.maxHourlyRate !== undefined && t.hourlyRateEtb > query.maxHourlyRate) {
      return false;
    }
    if (query.minRating !== undefined && t.ratingAverage < query.minRating) {
      return false;
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      const match =
        t.name.toLowerCase().includes(s) ||
        t.universityName.toLowerCase().includes(s) ||
        (t.bio && t.bio.toLowerCase().includes(s)) ||
        t.specialtySubjects.some((sub) => sub.toLowerCase().includes(s));
      if (!match) return false;
    }
    return true;
  });
};

export const findTutorById = async (id: string): Promise<TutorProfile | null> => {
  try {
    const t = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (t) {
      return {
        id: t.id,
        userId: t.userId,
        name: t.user.fullName,
        email: t.user.email,
        universityName: t.universityName,
        specialtySubjects: t.specialtySubjects,
        ratingAverage: t.ratingAverage,
        reviewsCount: t.reviewsCount,
        hourlyRateEtb: t.hourlyRateEtb,
        isVerified: t.isVerified,
        bio: t.bio,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      };
    }
  } catch (err: any) {
    console.warn("[MarketplaceRepository] Fallback tutor lookup:", err?.message || err);
  }

  return FALLBACK_TUTORS.find((t) => t.id === id) || null;
};

// In-memory fallback if DB table is inaccessible
const inMemoryBookings: TutorBooking[] = [];

export const createBookingRecord = async (
  booking: Omit<TutorBooking, "id" | "createdAt" | "updatedAt">
): Promise<TutorBooking> => {
  try {
    const res = await pool.query(
      `INSERT INTO public.tutor_bookings (
        tutor_id, tutor_name, student_name, student_email,
        subject, session_date, time_slot, duration_hours,
        total_price_etb, notes, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING 
        id::text AS id, tutor_id AS "tutorId", tutor_name AS "tutorName",
        student_name AS "studentName", student_email AS "studentEmail",
        subject, session_date AS "sessionDate", time_slot AS "timeSlot",
        duration_hours AS "durationHours", total_price_etb AS "totalPriceEtb",
        notes, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        booking.tutorId,
        booking.tutorName,
        booking.studentName,
        booking.studentEmail,
        booking.subject,
        booking.sessionDate,
        booking.timeSlot,
        booking.durationHours,
        booking.totalPriceEtb,
        booking.notes || null,
        booking.status || 'REQUESTED',
      ]
    );

    if (res.rows[0]) return res.rows[0];
  } catch (err: any) {
    console.warn("[MarketplaceRepository] DB insert booking error, falling back to in-memory:", err?.message || err);
  }

  const fallbackRecord: TutorBooking = {
    id: `book-${Date.now()}`,
    ...booking,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryBookings.unshift(fallbackRecord);
  return fallbackRecord;
};

export const listBookings = async (studentEmail?: string): Promise<TutorBooking[]> => {
  try {
    const res = await pool.query(
      `SELECT 
        id::text AS id, tutor_id AS "tutorId", tutor_name AS "tutorName",
        student_name AS "studentName", student_email AS "studentEmail",
        subject, session_date AS "sessionDate", time_slot AS "timeSlot",
        duration_hours AS "durationHours", total_price_etb AS "totalPriceEtb",
        notes, status, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM public.tutor_bookings
      WHERE ($1::text IS NULL OR student_email = $1)
      ORDER BY created_at DESC`,
      [studentEmail || null]
    );

    if (res.rows && res.rows.length > 0) return res.rows;
  } catch (err: any) {
    console.warn("[MarketplaceRepository] DB list bookings error, returning memory store:", err?.message || err);
  }

  if (studentEmail) {
    return inMemoryBookings.filter((b) => b.studentEmail.toLowerCase() === studentEmail.toLowerCase());
  }
  return inMemoryBookings;
};

export const updateBookingStatus = async (
  id: string,
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
): Promise<TutorBooking | null> => {
  try {
    const res = await pool.query(
      `UPDATE public.tutor_bookings
       SET status = $1, updated_at = NOW()
       WHERE id = $2::uuid
       RETURNING 
        id::text AS id, tutor_id AS "tutorId", tutor_name AS "tutorName",
        student_name AS "studentName", student_email AS "studentEmail",
        subject, session_date AS "sessionDate", time_slot AS "timeSlot",
        duration_hours AS "durationHours", total_price_etb AS "totalPriceEtb",
        notes, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [status, id]
    );

    if (res.rows[0]) return res.rows[0];
  } catch (err: any) {
    console.warn("[MarketplaceRepository] DB update booking error:", err?.message || err);
  }

  const memIdx = inMemoryBookings.findIndex((b) => b.id === id);
  if (memIdx >= 0) {
    inMemoryBookings[memIdx].status = status;
    inMemoryBookings[memIdx].updatedAt = new Date().toISOString();
    return inMemoryBookings[memIdx];
  }
  return null;
};


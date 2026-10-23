import { AcademicEvent, EventQuery } from "../types/event.types";
import { prisma } from "../../../db";

const FALLBACK_EVENTS: AcademicEvent[] = [
  {
    id: "evt-1",
    institutionId: "inst-aau",
    institutionCode: "AAU",
    institutionName: "Addis Ababa University",
    title: "12th National Higher Education Science & Research Conference",
    category: "CONFERENCE",
    dateGregorian: "November 14 - 16, 2026",
    dateEthiopic: "Hidar 5 - 7, 2019 E.C.",
    time: "09:00 AM - 05:00 PM EAT",
    location: "Sidist Kilo, Main Campus Ras Mekonnen Hall",
    isVirtual: false,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    description: "Annual research symposium featuring peer-reviewed papers from universities across Ethiopia, focusing on sustainable development, AI in agriculture, and engineering innovations.",
    registrationOpen: true,
    attendeesCount: 420,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-2",
    institutionId: "inst-moe",
    institutionCode: "MOE",
    institutionName: "Ministry of Education",
    title: "National University Exit Examination Registration Deadline",
    category: "DEADLINE",
    dateGregorian: "December 01, 2026",
    dateEthiopic: "Hidar 22, 2019 E.C.",
    time: "11:59 PM EAT",
    location: "Online MoE Portal (all public & accredited private universities)",
    isVirtual: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    description: "Official registration deadline for all graduating undergraduate students sitting for the national exit exam across all certified degree programs.",
    registrationOpen: true,
    attendeesCount: 15400,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-3",
    institutionId: "inst-astu",
    institutionCode: "ASTU",
    institutionName: "Adama Science and Technology University",
    title: "ASTU National Youth STEM & Robotics Hackathon 2026",
    category: "HACKATHON",
    dateGregorian: "November 28 - 30, 2026",
    dateEthiopic: "Hidar 19 - 21, 2019 E.C.",
    time: "48 Hours Non-stop",
    location: "ASTU ICT Center of Excellence, Adama",
    isVirtual: false,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    description: "Ethiopia-wide university coding and robotics challenge. Compete for 500,000 ETB in incubation grants and tech mentorship.",
    registrationOpen: true,
    attendeesCount: 280,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-4",
    institutionId: "inst-bdu",
    institutionCode: "BDU",
    institutionName: "Bahir Dar University",
    title: "Annual Graduate Career Fair & Industry Networking",
    category: "CAREER",
    dateGregorian: "December 10, 2026",
    dateEthiopic: "Tahsas 1, 2019 E.C.",
    time: "08:30 AM - 04:30 PM EAT",
    location: "Poly Campus Auditorium, Bahir Dar",
    isVirtual: false,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    description: "Meet recruiters from 60+ top Ethiopian engineering firms, banks, software houses, and agricultural enterprises.",
    registrationOpen: true,
    attendeesCount: 1250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-5",
    institutionId: "inst-ju",
    institutionCode: "JU",
    institutionName: "Jimma University",
    title: "Freshman STEM & Health Sciences Orientation Workshop",
    category: "ORIENTATION",
    dateGregorian: "October 28, 2026",
    dateEthiopic: "Tikimt 18, 2019 E.C.",
    time: "10:00 AM - 02:00 PM EAT",
    location: "Jimma University Main Campus & Virtual Livestream",
    isVirtual: true,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    description: "Introduction to campus facilities, academic regulations, dormitory assignments, and library digital systems for newly enrolled freshmen.",
    registrationOpen: true,
    attendeesCount: 3100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const findEvents = async (query: EventQuery): Promise<AcademicEvent[]> => {
  try {
    const where: any = {};

    if (query.category && query.category !== "ALL") {
      where.category = query.category;
    }
    if (query.institutionId) {
      where.institutionId = query.institutionId;
    }
    if (query.isVirtual !== undefined) {
      where.isVirtual = query.isVirtual;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { location: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const events = await prisma.academicEvent.findMany({
      where,
      include: {
        institution: {
          select: {
            code: true,
            nameEn: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (events && events.length > 0) {
      return events.map((ev) => ({
        id: ev.id,
        institutionId: ev.institutionId,
        institutionCode: ev.institution?.code || null,
        institutionName: ev.institution?.nameEn || null,
        title: ev.title,
        category: ev.category as any,
        dateGregorian: ev.dateGregorian,
        dateEthiopic: ev.dateEthiopic,
        time: ev.time,
        location: ev.location,
        isVirtual: ev.isVirtual,
        image: ev.image,
        description: ev.description,
        registrationOpen: ev.registrationOpen,
        attendeesCount: ev.attendeesCount,
        createdAt: ev.createdAt.toISOString(),
        updatedAt: ev.updatedAt.toISOString(),
      }));
    }
  } catch (err: any) {
    console.warn("[EventRepository] Falling back to curated academic events:", err?.message || err);
  }

  // Fallback filtering
  return FALLBACK_EVENTS.filter((ev) => {
    if (query.category && query.category !== "ALL" && ev.category !== query.category) {
      return false;
    }
    if (query.institutionId && ev.institutionId !== query.institutionId) {
      return false;
    }
    if (query.isVirtual !== undefined && ev.isVirtual !== query.isVirtual) {
      return false;
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      const match =
        ev.title.toLowerCase().includes(s) ||
        ev.description.toLowerCase().includes(s) ||
        ev.location.toLowerCase().includes(s) ||
        (ev.institutionName && ev.institutionName.toLowerCase().includes(s));
      if (!match) return false;
    }
    return true;
  });
};

export const findEventById = async (id: string): Promise<AcademicEvent | null> => {
  try {
    const ev = await prisma.academicEvent.findUnique({
      where: { id },
      include: {
        institution: {
          select: {
            code: true,
            nameEn: true,
          },
        },
      },
    });

    if (ev) {
      return {
        id: ev.id,
        institutionId: ev.institutionId,
        institutionCode: ev.institution?.code || null,
        institutionName: ev.institution?.nameEn || null,
        title: ev.title,
        category: ev.category as any,
        dateGregorian: ev.dateGregorian,
        dateEthiopic: ev.dateEthiopic,
        time: ev.time,
        location: ev.location,
        isVirtual: ev.isVirtual,
        image: ev.image,
        description: ev.description,
        registrationOpen: ev.registrationOpen,
        attendeesCount: ev.attendeesCount,
        createdAt: ev.createdAt.toISOString(),
        updatedAt: ev.updatedAt.toISOString(),
      };
    }
  } catch (err: any) {
    console.warn("[EventRepository] Fallback event lookup:", err?.message || err);
  }

  return FALLBACK_EVENTS.find((ev) => ev.id === id) || null;
};

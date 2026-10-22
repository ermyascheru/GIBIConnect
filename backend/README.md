# GIBIConnect Backend & Database Engine

This is the official backend API and relational database layer for the GIBIConnect platform.

---

## 🚀 Quick Start Guide

### 1. Start Database (PostgreSQL)

You can run PostgreSQL via Docker Compose:
```bash
docker compose up -d
```
Or use a local / managed PostgreSQL instance (e.g. Supabase, Neon, Railway) and update `DATABASE_URL` in `.env`.

---

### 2. Generate Prisma Client & Push Schema

```bash
# Generate the TypeScript Prisma client
npm run prisma:generate

# Push schema directly to the database
npm run prisma:push
```

---

### 3. Seed Verified Ethiopian University Data

Populate the database with Addis Ababa University, ASTU, campuses, faculties, departments, EUEE cutoffs, tuition rates, facilities, scholarships, and academic calendars:

```bash
npm run prisma:seed
```

---

### 4. Start Development Server

```bash
npm run dev
```

* **API Health Check**: `http://localhost:5000/health`
* **Institutions Directory**: `http://localhost:5000/api/v1/institutions`
* **8-Tab Campus Detail**: `http://localhost:5000/api/v1/institutions/AAU`
* **Prisma Studio Visual Inspector**: `npm run prisma:studio`

---

## 🗄️ Database Entity Schema Summary

- **`Institution`**: Core university record (Public/Private, Region, City, Verification Status, Leadership).
- **`Campus`**: Multi-campus physical locations (e.g. 5 Kilo, 6 Kilo, Akaki).
- **`Faculty`**: Schools and institutes with student and faculty counts.
- **`Department`**: Specialized departments.
- **`Program`**: Degree programs (Bachelor, Master, PhD) with semester course curricula.
- **`AdmissionCutoff`**: EUEE cutoffs by stream (Natural/Social), gender, and affirmative action developing quotas.
- **`TuitionRate`**: Subsidized cost-sharing vs. extension per-credit fees.
- **`Facility` & `FacilityImage`**: Libraries, laboratories, dorms, and sports centers with image galleries.
- **`Scholarship`**: MoE merit scholarships, university grants, and criteria.
- **`CalendarEvent`**: Ethiopic (Ge'ez) and Gregorian academic calendars.
- **`AcademicDoc`**: Syllabi, past exams, and research papers.
- **`AcademicEvent`**: Hackathons, conferences, and MoE selection deadlines.
- **`TutorProfile`**: Verified student tutors with hourly rates (ETB) and ratings.
- **`Bookmark`**: Saved universities, programs, events, and documents.

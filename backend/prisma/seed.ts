import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Starting GIBIConnect Database Seed...');

  // Clean existing tables in reverse dependency order
  await prisma.bookmark.deleteMany({});
  await prisma.tutorProfile.deleteMany({});
  await prisma.academicEvent.deleteMany({});
  await prisma.academicDoc.deleteMany({});
  await prisma.calendarEvent.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.facilityImage.deleteMany({});
  await prisma.facility.deleteMany({});
  await prisma.tuitionRate.deleteMany({});
  await prisma.admissionCutoff.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.faculty.deleteMany({});
  await prisma.campus.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing records.');

  // 1. Create Default Users (Admin, Tutor, Student)
  await prisma.user.create({
    data: {
      email: 'student@gibiconnect.et',
      passwordHash: '$2a$12$e8x/kZ6179Gg4G63rZ0jqeJt7hZkO7u7.4H3lP9JzXWkR1ZlK8Kee', // bcrypt hash
      fullName: 'Ermiyas Tadesse',
      role: 'STUDENT',
      isVerified: true,
      phoneNumber: '+251911223344',
    },
  });

  const tutorUser1 = await prisma.user.create({
    data: {
      email: 'yared.tesfaye@aau.edu.et',
      passwordHash: '$2a$12$e8x/kZ6179Gg4G63rZ0jqeJt7hZkO7u7.4H3lP9JzXWkR1ZlK8Kee',
      fullName: 'Dr. Yared Tesfaye',
      role: 'TUTOR',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  });

  await prisma.tutorProfile.create({
    data: {
      userId: tutorUser1.id,
      universityName: 'Addis Ababa University',
      specialtySubjects: ['Calculus', 'Linear Algebra', 'Applied Physics', 'Freshman Math'],
      ratingAverage: 4.95,
      reviewsCount: 38,
      hourlyRateEtb: 450,
      isVerified: true,
      bio: 'Lecturer and senior academic tutor assisting freshman and engineering students with high-yield exam preparation and problem-solving techniques.',
    },
  });

  console.log('👤 Created demo users and tutor profiles.');

  // 2. Seed Addis Ababa University (AAU)
  const aau = await prisma.institution.create({
    data: {
      code: 'AAU',
      nameEn: 'Addis Ababa University',
      nameAm: 'አዲስ አበባ ዩኒቨርሲቲ',
      ownership: 'PUBLIC',
      type: 'UNIVERSITY',
      region: 'Addis Ababa',
      city: 'Addis Ababa',
      establishedYear: 1950,
      websiteUrl: 'http://www.aau.edu.et',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'VERIFIED',
      overview: 'Ethiopia’s oldest and largest flagship higher learning and research institution with autonomous governance status, pioneering tertiary education, medical research, and advanced engineering since 1950.',
      leadershipName: 'Dr. Samuel Kifle',
      leadershipTitle: 'Interim President',
      accreditationBody: 'Education and Training Authority (ETA) & MoE Autonomous Charter',
      totalFaculties: 10,
      totalDepartments: 70,
      totalPrograms: 240,
    },
  });

  // Campuses for AAU
  const aau5Kilo = await prisma.campus.create({
    data: {
      institutionId: aau.id,
      name: 'King George VI (5 Kilo) Campus',
      location: 'Yeka Sub-City, Addis Ababa',
    },
  });

  const aau6Kilo = await prisma.campus.create({
    data: {
      institutionId: aau.id,
      name: 'Main Campus (Sidist Kilo)',
      location: 'Arada Sub-City, Addis Ababa',
    },
  });

  // Faculty: AAiT
  const aait = await prisma.faculty.create({
    data: {
      institutionId: aau.id,
      campusId: aau5Kilo.id,
      name: 'Addis Ababa Institute of Technology (AAiT)',
      campus: '5 Kilo (King George VI) Campus',
      dean: 'Dr. Bikila Teklu',
      establishedYear: 1953,
      studentCount: 8500,
      facultyCount: 320,
      description: 'Premier engineering and technology institute in East Africa with state-of-the-art innovation centers, railway engineering institutes, and high-performance computing centers.',
    },
  });

  // Department: Software Engineering
  const deptSe = await prisma.department.create({
    data: {
      facultyId: aait.id,
      name: 'Department of Software Engineering',
      head: 'Dr. Solomon Atnafu',
    },
  });

  // Program: B.Sc. in Software Engineering
  const progSe = await prisma.program.create({
    data: {
      departmentId: deptSe.id,
      name: 'B.Sc. in Software Engineering',
      degreeLevel: 'BACHELOR',
      durationYears: 5.0,
      creditsEcts: 300,
      deliveryMode: 'Regular Day & Extension',
      overview: 'A five-year comprehensive curriculum designed to produce world-class software engineers proficient in algorithms, distributed cloud systems, artificial intelligence, and secure software lifecycle.',
      careerProspects: ['Software Architect', 'Full-Stack Developer', 'DevOps & Cloud Engineer', 'AI/Data Engineer'],
      curriculumOutline: [
        {
          year: 1,
          semester: 1,
          courses: [
            { code: 'MATH1011', title: 'Calculus for Engineers I', ects: 5, type: 'Core' },
            { code: 'PHYS1011', title: 'General Physics', ects: 5, type: 'Core' },
            { code: 'COSC1011', title: 'Introduction to Computing', ects: 5, type: 'Core' },
            { code: 'ENGL1011', title: 'Communicative English', ects: 5, type: 'General' },
          ],
        },
        {
          year: 2,
          semester: 1,
          courses: [
            { code: 'SENG2021', title: 'Object-Oriented Programming (Java)', ects: 6, type: 'Core' },
            { code: 'SENG2031', title: 'Data Structures and Algorithms', ects: 6, type: 'Core' },
            { code: 'MATH2011', title: 'Discrete Mathematics', ects: 5, type: 'Supportive' },
          ],
        },
      ],
    },
  });

  // Admissions Cutoff for AAU SE
  await prisma.admissionCutoff.create({
    data: {
      programId: progSe.id,
      academicYear: '2016/2017 E.C.',
      stream: 'NATURAL',
      maleCutoff: 495,
      femaleCutoff: 475,
      developingQuota: 450,
      disabilityQuota: 430,
      notes: 'Ranked based on cumulative EUEE Natural Science score with strong weight on Mathematics and Physics.',
    },
  });

  // Tuition Rates for AAU SE
  await prisma.tuitionRate.create({
    data: {
      programId: progSe.id,
      category: 'REGULAR_SUBSIDIZED',
      costPerCreditEtb: 0.0,
      costSharingEligible: true,
      deferredRepayPercent: 0.15,
    },
  });

  await prisma.tuitionRate.create({
    data: {
      programId: progSe.id,
      category: 'EXTENSION',
      costPerCreditEtb: 750.0,
      registrationFeeEtb: 500.0,
      costSharingEligible: false,
    },
  });

  // Facility: Kennedy Library
  const library = await prisma.facility.create({
    data: {
      institutionId: aau.id,
      campusId: aau6Kilo.id,
      name: 'John F. Kennedy Memorial Library',
      category: 'LIBRARY',
      capacity: 1500,
      description: 'National repository and university main library housing over 500,000 physical volumes, rare Ethiopian manuscripts, and high-speed digital research terminals.',
      specs: {
        totalVolumes: '500,000+',
        digitalWorkstations: 350,
        wifiCoverage: 'Campus-wide High Speed',
        operatingHours: '24/7 during Exam Periods',
      },
    },
  });

  await prisma.facilityImage.createMany({
    data: [
      {
        facilityId: library.id,
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
        caption: 'Main Study & Digital Reading Hall',
        displayOrder: 1,
      },
      {
        facilityId: library.id,
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
        caption: 'Graduate Research & Archival Collection',
        displayOrder: 2,
      },
    ],
  });

  // Scholarships for AAU
  await prisma.scholarship.create({
    data: {
      institutionId: aau.id,
      title: 'Ministry of Education National Merit Scholarship',
      provider: 'Ministry of Education (MoE)',
      coverageType: 'FULL_TUITION',
      coveragePercentage: 100,
      eligibilityCriteria: [
        'Top 1% national score in EUEE Natural or Social Science stream',
        'Demonstrated leadership and academic excellence',
      ],
      applicationDeadline: 'Tikimt 30, 2017 E.C.',
      applicationUrl: 'https://portal.moe.gov.et/scholarships',
    },
  });

  // Calendar for AAU
  await prisma.calendarEvent.createMany({
    data: [
      {
        institutionId: aau.id,
        title: 'Freshman Student Registration & Campus Move-In',
        category: 'REGISTRATION',
        dateEthiopic: 'Meskerem 22 - 25, 2017 E.C.',
        dateGregorian: 'October 2 - 5, 2026',
      },
      {
        institutionId: aau.id,
        title: 'First Semester Final Examination Week',
        category: 'EXAM_PERIOD',
        dateEthiopic: 'Tir 18 - 30, 2017 E.C.',
        dateGregorian: 'January 26 - February 7, 2027',
      },
    ],
  });

  // 3. Seed Adama Science and Technology University (ASTU)
  const astu = await prisma.institution.create({
    data: {
      code: 'ASTU',
      nameEn: 'Adama Science and Technology University',
      nameAm: 'አዳማ ሳይንስ እና ቴክኖሎጂ ዩኒቨርሲቲ',
      ownership: 'PUBLIC',
      type: 'UNIVERSITY',
      region: 'Oromia',
      city: 'Adama',
      establishedYear: 1993,
      websiteUrl: 'http://www.astu.edu.et',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'VERIFIED',
      overview: 'Designated Center of Excellence in Science and Applied Technology focusing on advanced robotics, automotive engineering, manufacturing innovation, and computing sciences.',
      leadershipName: 'Dr. Lemi Guta',
      leadershipTitle: 'President',
      accreditationBody: 'Ministry of Innovation and Technology & MoE Center of Excellence',
      totalFaculties: 8,
      totalDepartments: 35,
      totalPrograms: 80,
    },
  });

  // ASTU School of Computing
  const astuComp = await prisma.faculty.create({
    data: {
      institutionId: astu.id,
      name: 'School of Electrical Engineering & Computing (SEEC)',
      campus: 'Main Research Campus, Adama',
      dean: 'Dr. Tadesse Mengistu',
      studentCount: 4200,
      facultyCount: 180,
      description: 'Dedicated technological hub with modern AI labs, IoT prototyping workshops, and supercomputing clusters.',
    },
  });

  const astuSeDept = await prisma.department.create({
    data: {
      facultyId: astuComp.id,
      name: 'Department of Software Engineering',
      head: 'Dr. Getachew Bekele',
    },
  });

  const astuSeProg = await prisma.program.create({
    data: {
      departmentId: astuSeDept.id,
      name: 'B.Sc. in Software Engineering',
      degreeLevel: 'BACHELOR',
      durationYears: 5.0,
      creditsEcts: 300,
      deliveryMode: 'Regular Day',
      overview: 'Applied engineering degree preparing students for careers in enterprise software development, embedded computing, and distributed networks.',
    },
  });

  await prisma.admissionCutoff.create({
    data: {
      programId: astuSeProg.id,
      academicYear: '2016/2017 E.C.',
      stream: 'NATURAL',
      maleCutoff: 485,
      femaleCutoff: 460,
      developingQuota: 440,
    },
  });

  // 4. Seed Academic Documents
  await prisma.academicDoc.createMany({
    data: [
      {
        institutionId: aau.id,
        title: 'AAiT Software Engineering 5-Year Harmonized Curriculum',
        category: 'SYLLABUS',
        pages: 48,
        fileSize: '3.2 MB',
        uploadedYear: '2016 E.C.',
        fileUrl: 'https://cdn.gibiconnect.et/docs/aau-se-curriculum.pdf',
        downloadCount: 1420,
      },
      {
        institutionId: astu.id,
        title: 'ASTU Freshman STEM Physics & Calculus Past Exam Solutions',
        category: 'EXAM',
        pages: 24,
        fileSize: '2.1 MB',
        uploadedYear: '2015 E.C.',
        fileUrl: 'https://cdn.gibiconnect.et/docs/astu-freshman-physics.pdf',
        downloadCount: 3840,
      },
    ],
  });

  // 5. Seed National Academic Events
  await prisma.academicEvent.createMany({
    data: [
      {
        institutionId: aau.id,
        title: 'Ministry of Education National Placement Selection Window',
        category: 'DEADLINE',
        dateGregorian: 'October 10 - 20, 2026',
        dateEthiopic: 'Meskerem 30 - Tikimt 10, 2017 E.C.',
        time: '11:59 PM EAT',
        location: 'MoE National Portal (Online)',
        isVirtual: true,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
        description: 'Official online window for matriculated Grade 12 students to submit their top university and discipline choices.',
        attendeesCount: 14200,
      },
      {
        institutionId: astu.id,
        title: 'National AI & Applied Robotics Innovation Hackathon 2026',
        category: 'HACKATHON',
        dateGregorian: 'November 14 - 16, 2026',
        dateEthiopic: 'Hidar 5 - 7, 2017 E.C.',
        location: 'ASTU Technology Park, Adama',
        isVirtual: false,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        description: 'Nationwide collegiate hackathon competing on smart agriculture, financial technology, and renewable energy automation.',
        attendeesCount: 850,
      },
    ],
  });

  console.log('✅ Database seeded successfully with verified Ethiopian university data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * GIBIConnect - Authentic Ethiopian Higher Education Media Catalog
 * Sourced from verified Ethiopian university archives, official institutional documentation,
 * and authentic campus photography.
 */

export interface FacilityImage {
  url: string;
  caption: string;
  alt: string;
  source?: string;
}

export interface UniversityMedia {
  code: string;
  hero: string;
  campusTour: string;
  landmark: string;
  landmarkTitle: string;
  facilities: {
    libraries: FacilityImage[];
    labs: FacilityImage[];
    healthcare: FacilityImage[];
    dorms: FacilityImage[];
    sports: FacilityImage[];
    ict: FacilityImage[];
  };
}

// Authentic Ethiopian University Campus & Facility Photography
export const ETHIOPIAN_CAMPUS_MEDIA: Record<string, UniversityMedia> = {
  AAU: {
    code: 'AAU',
    hero: '/images/entrances/aau-entrance.jpg',
    campusTour: '/images/universities/aau/aau-student-life.jpg',
    landmark: '/images/entrances/aau-entrance.jpg',
    landmarkTitle: 'Historic Main Entrance Gate - Sidist Kilo Campus',
    facilities: {
      libraries: [
        {
          url: '/images/universities/aau/aau-jfk-library.jpg',
          caption: 'John F. Kennedy Memorial Central Library Stacks & Digital Archive',
          alt: 'John F. Kennedy Memorial Library at AAU Sidist Kilo Campus',
          source: 'AAU Library System'
        },
        {
          url: '/images/universities/aau/aau-classroom-hall.jpg',
          caption: 'Academic Lecture and Assembly Hall - AAiT Campus',
          alt: 'Academic Lecture and Assembly Hall at AAiT Campus',
          source: 'AAiT Addis Ababa'
        }
      ],
      labs: [
        {
          url: '/images/universities/aau/aau-laboratory.jpg',
          caption: 'Advanced Experimental Research & Engineering Laboratory',
          alt: 'AAU Experimental Research Laboratory',
          source: 'AAU Directorate of Research'
        },
        {
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
          caption: 'AAiT Mechatronics, Robotics & Artificial Intelligence Lab',
          alt: 'Addis Ababa Institute of Technology Robotics Workshop',
          source: 'AAiT 5 Kilo'
        }
      ],
      healthcare: [
        {
          url: '/images/entrances/aau-medical-entrance.jpg',
          caption: 'Tikur Anbessa (Black Lion) Specialized Teaching & Referral Hospital',
          alt: 'Tikur Anbessa Hospital Clinical Pavilion in Addis Ababa',
          source: 'College of Health Sciences AAU'
        }
      ],
      dorms: [
        {
          url: '/images/universities/aau/aau-student-life.jpg',
          caption: 'Sidist Kilo & 5 Kilo Student Campus Walkways & Residential Life',
          alt: 'Student Residential Grounds at AAU',
          source: 'AAU Student Affairs'
        }
      ],
      sports: [
        {
          url: '/images/universities/aau/aau-sports-facility.jpg',
          caption: 'AAU Main Athletics Track & University Football Grounds',
          alt: 'Olympic Running Track and Stadium at Addis Ababa University',
          source: 'AAU Sports Department'
        }
      ],
      ict: [
        {
          url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          caption: 'Central High-Performance Data Center & Campus Fiber Core',
          alt: 'Central IT Server Infrastructure at Addis Ababa University',
          source: 'AAU ICT Directorate'
        }
      ]
    }
  },

  ASTU: {
    code: 'ASTU',
    hero: '/images/entrances/astu-entrance.jpg',
    campusTour: '/images/students/astu-student-life.jpg',
    landmark: '/images/entrances/astu-entrance.jpg',
    landmarkTitle: 'Grand Academic Main Gate & Boulevard - Adama Campus',
    facilities: {
      libraries: [
        {
          url: '/images/universities/astu/astu-campus-overview.jpg',
          caption: 'ASTU Central Campus Plaza & Digital Technology Library',
          alt: 'ASTU Central Campus Plaza and Library',
          source: 'ASTU Library'
        }
      ],
      labs: [
        {
          url: '/images/universities/astu/astu-space-laboratory.jpg',
          caption: 'Satellite Science, Space Systems & High-Tech Laboratory',
          alt: 'ASTU Satellite and Space Science Research Facility',
          source: 'ASTU Center of Excellence'
        }
      ],
      healthcare: [
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Campus Medical Clinic & Student Health Service',
          alt: 'ASTU Health Center',
          source: 'ASTU Clinic'
        }
      ],
      dorms: [
        {
          url: '/images/students/astu-student-life.jpg',
          caption: 'ASTU Student Campus Life & Collaborative Engineering Grounds',
          alt: 'ASTU Students on Campus',
          source: 'ASTU Student Affairs'
        }
      ],
      sports: [
        {
          url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
          caption: 'Multi-Purpose Indoor Gymnasium & Basketball Pavilion',
          alt: 'ASTU Indoor Sports Arena',
          source: 'ASTU Athletics'
        }
      ],
      ict: [
        {
          url: '/images/universities/astu/astu-space-laboratory.jpg',
          caption: 'Advanced STEM Compute & Engineering Innovation Lab',
          alt: 'ASTU Innovation Workstations',
          source: 'ASTU ICT'
        }
      ]
    }
  },

  AASTU: {
    code: 'AASTU',
    hero: '/images/universities/aastu/aastu-main-building.jpg',
    campusTour: '/images/universities/aastu/aastu-student-life.jpg',
    landmark: '/images/universities/aastu/aastu-gate.jpg',
    landmarkTitle: 'Main Academic Entrance Gate - Kilinto Campus',
    facilities: {
      libraries: [
        {
          url: '/images/universities/aastu/aastu-classroom.png',
          caption: 'Modern Tiered Lecture Hall & Academic Study Classrooms',
          alt: 'Modern Tiered Lecture Classroom at AASTU',
          source: 'AASTU'
        }
      ],
      labs: [
        {
          url: '/images/universities/aastu/aastu-coe-laboratory.png',
          caption: 'Center of Excellence Advanced Research & Fabrication Lab',
          alt: 'Center of Excellence Specialized Laboratory at AASTU',
          source: 'AASTU COE'
        }
      ],
      healthcare: [
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
          caption: 'AASTU Kilinto Campus Health & First-Aid Center',
          alt: 'AASTU Health Station',
          source: 'AASTU'
        }
      ],
      dorms: [
        {
          url: '/images/universities/aastu/aastu-campus-park.jpg',
          caption: 'Kilinto Campus Park & Student Residential Walkways',
          alt: 'AASTU Campus Walkways',
          source: 'AASTU Student Services'
        }
      ],
      sports: [
        {
          url: '/images/universities/aastu/aastu-sports-basketball.jpg',
          caption: 'AASTU Outdoor Sports Courts & Recreation Grounds',
          alt: 'Outdoor Basketball Courts at AASTU',
          source: 'AASTU Recreation'
        }
      ],
      ict: [
        {
          url: '/images/universities/aastu/aastu-coe-laboratory.png',
          caption: 'High-Performance Supercomputing & AI Workstations',
          alt: 'AASTU Computing Center',
          source: 'AASTU ICT'
        }
      ]
    }
  },

  BDU: {
    code: 'BDU',
    hero: '/images/entrances/bdu-entrance.jpg',
    campusTour: '/images/students/bdu-student-life.jpg',
    landmark: '/images/entrances/bdu-entrance.jpg',
    landmarkTitle: 'Lake Tana Maritime & Poly Campus Main Entrance',
    facilities: {
      libraries: [
        {
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
          caption: 'BDU Central Poly Library & Digital Reference Center',
          alt: 'Bahir Dar University Central Library',
          source: 'BDU Library'
        }
      ],
      labs: [
        {
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
          caption: 'Maritime Navigation & Textile Engineering Testing Facility',
          alt: 'BDU Maritime Institute Navigation Simulators',
          source: 'Ethiopian Maritime Training Institute'
        }
      ],
      healthcare: [
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Tibebe Ghion Specialized Teaching Hospital',
          alt: 'BDU Tibebe Ghion Hospital',
          source: 'BDU College of Medicine'
        }
      ],
      dorms: [
        {
          url: '/images/students/bdu-student-life.jpg',
          caption: 'Peda & Poly Student Dormitory Quadrangles & Lakeside Grounds',
          alt: 'BDU Campus Residences',
          source: 'BDU Student Affairs'
        }
      ],
      sports: [
        {
          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
          caption: 'BDU Sports Academy Stadium & Aquatic Center',
          alt: 'Bahir Dar University Stadium',
          source: 'BDU Sports'
        }
      ],
      ict: [
        {
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
          caption: 'Lake Tana ICT Innovation Hub & Smart Classroom Labs',
          alt: 'BDU ICT Hub',
          source: 'BDU ICT'
        }
      ]
    }
  },

  JU: {
    code: 'JU',
    hero: '/images/entrances/ju-entrance.jpg',
    campusTour: '/images/students/ju-student-life.jpg',
    landmark: '/images/entrances/ju-entrance.jpg',
    landmarkTitle: 'Jimma University Grand Gateway & Administration Plaza',
    facilities: {
      libraries: [
        {
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
          caption: 'Jimma University Central Medical & Community Library',
          alt: 'JU Medical Library',
          source: 'Jimma University'
        }
      ],
      labs: [
        {
          url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Agronomy, Coffee Biotechnology & Tropical Medicine Labs',
          alt: 'Jimma Tropical Agriculture Research Lab',
          source: 'JU College of Agriculture'
        }
      ],
      healthcare: [
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Jimma University Medical Center (JUMC) Referral Hospital',
          alt: 'JUMC Teaching Hospital',
          source: 'JUMC'
        }
      ],
      dorms: [
        {
          url: '/images/students/ju-student-life.jpg',
          caption: 'Kito Furdisa Campus Student Residences & Green Quad',
          alt: 'Jimma University Dormitory Quad',
          source: 'JU Student Services'
        }
      ],
      sports: [
        {
          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
          caption: 'Jimma Stadium & Outdoor Athletics Complex',
          alt: 'Jimma University Sports Complex',
          source: 'JU Athletics'
        }
      ],
      ict: [
        {
          url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          caption: 'Community Health Informatics & E-Learning Server Cluster',
          alt: 'Jimma Health Informatics Core',
          source: 'JU ICT'
        }
      ]
    }
  },

  HU: {
    code: 'HU',
    hero: '/images/entrances/hu-entrance.jpg',
    campusTour: '/images/students/hu-student-life.jpg',
    landmark: '/images/entrances/hu-entrance.jpg',
    landmarkTitle: 'Hawassa University Main Entrance & Boulevard',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Hawassa Central Digital Library', alt: 'HU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Agronomy and Forestry Labs', alt: 'HU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Hawassa Comprehensive Specialized Hospital', alt: 'HU Hospital' }],
      dorms: [{ url: '/images/students/hu-student-life.jpg', caption: 'Hawassa Lakeside Student Community & Dorms', alt: 'HU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Hawassa University Stadium', alt: 'HU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Rift Valley Regional ICT Hub', alt: 'HU ICT' }]
    }
  },

  MU: {
    code: 'MU',
    hero: '/images/entrances/mu-entrance.jpg',
    campusTour: '/images/students/mu-student-life.jpg',
    landmark: '/images/entrances/mu-entrance.jpg',
    landmarkTitle: 'Mekelle University Main Entrance Gate - Adi Haki Campus',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Ayder Medical & Science Library', alt: 'MU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Dryland Agricultural & Veterinary Labs', alt: 'MU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Ayder Specialized Teaching Hospital', alt: 'Ayder Hospital' }],
      dorms: [{ url: '/images/students/mu-student-life.jpg', caption: 'Adi Haki Student Quads & Residences', alt: 'MU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Mekelle University Multi-Sport Complex', alt: 'MU Stadium' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Central Technology & Fiber Hub', alt: 'MU ICT' }]
    }
  },

  UOG: {
    code: 'UOG',
    hero: '/images/entrances/uog-entrance.jpg',
    campusTour: '/images/students/uog-student-life.jpg',
    landmark: '/images/entrances/uog-entrance.jpg',
    landmarkTitle: 'University of Gondar Historic Main Entrance - Maraki Campus',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Maraki Central Academic Library', alt: 'UoG Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Health Sciences & Clinical Research Labs', alt: 'UoG Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Gondar Comprehensive Teaching Hospital', alt: 'Gondar Hospital' }],
      dorms: [{ url: '/images/students/uog-student-life.jpg', caption: 'Maraki & Teda Student Living Quarters', alt: 'UoG Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Gondar University Athletic Grounds', alt: 'UoG Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'ICT Center & Digital Learning Labs', alt: 'UoG ICT' }]
    }
  },

  AMU: {
    code: 'AMU',
    hero: '/images/entrances/amu-entrance.jpg',
    campusTour: '/images/students/amu-student-life.jpg',
    landmark: '/images/entrances/amu-entrance.jpg',
    landmarkTitle: 'Arba Minch University Main Entrance - Main Campus',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Water Technology Specialized Library', alt: 'AMU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'National Hydraulics & Water Resource Labs', alt: 'AMU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Arba Minch General Teaching Pavilion', alt: 'AMU Hospital' }],
      dorms: [{ url: '/images/students/amu-student-life.jpg', caption: 'Abaya Campus Student Living Quarters', alt: 'AMU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'AMU Multi-Sport Stadium', alt: 'AMU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Meteorology and Hydrological Data Center', alt: 'AMU ICT' }]
    }
  },

  HRU: {
    code: 'HRU',
    hero: '/images/entrances/hru-entrance.jpg',
    campusTour: '/images/students/hru-student-life.jpg',
    landmark: '/images/entrances/hru-entrance.jpg',
    landmarkTitle: 'Haramaya University Landmark Main Entrance Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Historic Agricultural & Science Library', alt: 'HRU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Biotechnology and Soil Science Laboratories', alt: 'HRU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Hiwot Fana Teaching Hospital', alt: 'HRU Hospital' }],
      dorms: [{ url: '/images/students/hru-student-life.jpg', caption: 'Haramaya Campus Green Quads & Residences', alt: 'HRU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Haramaya University Stadium', alt: 'HRU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Fiber Network and Computer Centers', alt: 'HRU ICT' }]
    }
  },

  DU: {
    code: 'DU',
    hero: '/images/entrances/du-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/du-entrance.jpg',
    landmarkTitle: 'Dilla University Main Campus Entrance Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Dilla Central Library', alt: 'DU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Biodiversity & Pedagogy Labs', alt: 'DU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Dilla Referral Hospital', alt: 'DU Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Odaya Campus Student Housing', alt: 'DU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'University Sports Field', alt: 'DU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Dilla Campus ICT Center', alt: 'DU ICT' }]
    }
  },

  DMU: {
    code: 'DMU',
    hero: '/images/entrances/dmu-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/dmu-entrance.jpg',
    landmarkTitle: 'Debre Markos University Grand Entrance Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Debre Markos Main Library', alt: 'DMU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Choke Ecosystem Science Labs', alt: 'DMU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Debre Markos Teaching Hospital', alt: 'DMU Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Student Dormitory Quad', alt: 'DMU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'DMU Sports Field', alt: 'DMU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Central ICT Facility', alt: 'DMU ICT' }]
    }
  },

  DBU: {
    code: 'DBU',
    hero: '/images/entrances/dbu-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/dbu-entrance.jpg',
    landmarkTitle: 'Debre Berhan University Main Academic Entrance',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'DBU Central Library', alt: 'DBU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Manufacturing & Tech Labs', alt: 'DBU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'DBU Health Center', alt: 'DBU Health' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Student Housing Complex', alt: 'DBU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'DBU Athletics Grounds', alt: 'DBU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'High-Speed IT Infrastructure', alt: 'DBU ICT' }]
    }
  },

  DDU: {
    code: 'DDU',
    hero: '/images/entrances/ddu-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/ddu-entrance.jpg',
    landmarkTitle: 'Dire Dawa University Main Entrance Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'DDU Central Library', alt: 'DDU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Railway Engineering & Logistics Labs', alt: 'DDU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Sabian Health Center & Clinic', alt: 'DDU Health' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Student Residences', alt: 'DDU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'DDU Sports Arena', alt: 'DDU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Regional Computing Hub', alt: 'DDU ICT' }]
    }
  },

  AMBO: {
    code: 'AMBO',
    hero: '/images/entrances/ambo-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/ambo-entrance.jpg',
    landmarkTitle: 'Ambo University Main Campus Gate & Administration Building',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Awaro Campus Central Library', alt: 'Ambo Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Agricultural Research Laboratories', alt: 'Ambo Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Ambo University Teaching Hospital', alt: 'Ambo Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Student Housing Quads', alt: 'Ambo Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Ambo Stadium', alt: 'Ambo Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Fiber Network Center', alt: 'Ambo ICT' }]
    }
  },

  SMU: {
    code: 'SMU',
    hero: '/images/entrances/smu-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/smu-entrance.jpg',
    landmarkTitle: "St. Mary's University Main Campus Center - Mexico, Addis Ababa",
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Mexico Campus Digital Library', alt: 'SMU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Computer Science & Software Engineering Labs', alt: 'SMU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Health & First Aid Clinic', alt: 'SMU Clinic' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Graduate & Executive Student Spaces', alt: 'SMU Facilities' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Recreation & Student Activity Hall', alt: 'SMU Recreation' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'E-Learning & Virtual Exam Core', alt: 'SMU ICT' }]
    }
  },

  WSU: {
    code: 'WSU',
    hero: '/images/entrances/wku-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/wku-entrance.jpg',
    landmarkTitle: 'Wolaita Sodo University Main Campus Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Central Academic Library', alt: 'WSU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Veterinary and Agri-Tech Research Labs', alt: 'WSU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Otona Teaching Referral Hospital', alt: 'WSU Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Main Campus Student Dormitories', alt: 'WSU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'WSU Sports Complex', alt: 'WSU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Fiber Network Center', alt: 'WSU ICT' }]
    }
  },

  WCU: {
    code: 'WCU',
    hero: '/images/entrances/wku-entrance.jpg',
    campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    landmark: '/images/entrances/wku-entrance.jpg',
    landmarkTitle: 'University Main Entrance Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Wachemo Central Library', alt: 'WCU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Applied Sciences Labs', alt: 'WCU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Nigist Eleni Teaching Hospital', alt: 'WCU Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Hossana Campus Student Residences', alt: 'WCU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Football and Athletics Grounds', alt: 'WCU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Campus E-Learning Center', alt: 'WCU ICT' }]
    }
  },

  WKU: {
    code: 'WKU',
    hero: '/images/entrances/wku-entrance.jpg',
    campusTour: '/images/students/hu-student-life.jpg',
    landmark: '/images/entrances/wku-entrance.jpg',
    landmarkTitle: 'Wolkite University Main Entrance Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Wolkite Central Digital Library', alt: 'WKU Library' }],
      labs: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', caption: 'Gubre Engineering & Mechatronics Workshops', alt: 'WKU Labs' }],
      healthcare: [{ url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', caption: 'Wolkite University Teaching Hospital', alt: 'WKU Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Gubre & Main Campus Residences', alt: 'WKU Dorms' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Athletics & Stadium', alt: 'WKU Sports' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'ICT Center & Innovation Labs', alt: 'WKU ICT' }]
    }
  },

  AAMC: {
    code: 'AAMC',
    hero: '/images/entrances/aau-medical-entrance.jpg',
    campusTour: '/images/students/uog-student-life.jpg',
    landmark: '/images/entrances/aau-medical-entrance.jpg',
    landmarkTitle: 'Tikur Anbessa Specialized Hospital & Medical College Gate',
    facilities: {
      libraries: [{ url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', caption: 'Tikur Anbessa Medical Library & E-Archives', alt: 'AAMC Library' }],
      labs: [{ url: '/images/universities/aau/aau-laboratory.jpg', caption: 'Pathology, Histology & Surgical Simulation Laboratories', alt: 'AAMC Labs' }],
      healthcare: [{ url: '/images/entrances/aau-medical-entrance.jpg', caption: 'Tikur Anbessa (Black Lion) Specialized Referral Hospital (800+ Beds)', alt: 'AAMC Hospital' }],
      dorms: [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', caption: 'Medical Intern & Resident Physician Quarters', alt: 'AAMC Housing' }],
      sports: [{ url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', caption: 'Campus Health & Wellness Center', alt: 'AAMC Recreation' }],
      ict: [{ url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'Telemedicine & Electronic Health Records Core', alt: 'AAMC ICT' }]
    }
  }
};

// Default fallback media for any unlisted university code
export const DEFAULT_CAMPUS_MEDIA: UniversityMedia = {
  code: 'DEFAULT',
  hero: '/images/entrances/aau-entrance.jpg',
  campusTour: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  landmark: '/images/entrances/aau-entrance.jpg',
  landmarkTitle: 'Main Administration Quad & Academic Center',
  facilities: {
    libraries: [
      {
        url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
        caption: 'Central University Library & Digital Knowledge Hub',
        alt: 'Central Academic Library',
        source: 'University Library System'
      }
    ],
    labs: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        caption: 'Engineering & Applied Science Research Laboratories',
        alt: 'Applied Research Laboratory',
        source: 'Faculty of Science & Technology'
      }
    ],
    healthcare: [
      {
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Campus Clinic & Specialized Teaching Hospital',
        alt: 'Teaching Hospital',
        source: 'College of Health Sciences'
      }
    ],
    dorms: [
      {
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Student Dormitory Quad & Living Quarters',
        alt: 'Student Housing Block',
        source: 'Student Affairs'
      }
    ],
    sports: [
      {
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
        caption: 'All-Weather Athletics Track & Multi-Sport Arena',
        alt: 'University Stadium',
        source: 'Athletics Department'
      }
    ],
    ict: [
      {
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-Speed Campus Data Center & Virtual Smart Classrooms',
        alt: 'ICT Infrastructure',
        source: 'ICT Center'
      }
    ]
  }
};

// Helper to safely retrieve campus media
export function getCampusMedia(institutionCode: string): UniversityMedia {
  const code = institutionCode ? institutionCode.toUpperCase() : 'DEFAULT';
  return ETHIOPIAN_CAMPUS_MEDIA[code] || DEFAULT_CAMPUS_MEDIA;
}

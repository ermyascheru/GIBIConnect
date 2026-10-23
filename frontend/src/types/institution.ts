export type VerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED' | 'CONFLICTING' | 'REJECTED';

export type InstitutionOwnership = 'PUBLIC' | 'PRIVATE';
export type InstitutionType = 'UNIVERSITY' | 'COLLEGE' | 'INSTITUTE';
export type EthiopianRegion =
  | 'Addis Ababa'
  | 'Oromia'
  | 'Amhara'
  | 'Tigray'
  | 'Sidama'
  | 'SNNPR'
  | 'Dire Dawa'
  | 'Harari'
  | 'Afar'
  | 'Somali'
  | 'Benishangul-Gumuz'
  | 'Gambela';

export interface AdmissionCutoff {
  academicYear: string;
  programName: string;
  maleCutoff: number;
  femaleCutoff: number;
  stream: 'NATURAL' | 'SOCIAL';
}

export interface TuitionFee {
  programName: string;
  degreeLevel: 'BACHELOR' | 'MASTER' | 'PHD';
  category: 'REGULAR' | 'EXTENSION' | 'INTERNATIONAL';
  costPerCreditEtb: number;
  costSharingEligible: boolean;
}

export interface Institution {
  id: string;
  code: string;
  nameEn: string;
  nameAm?: string;
  ownership: InstitutionOwnership;
  type: InstitutionType;
  region: EthiopianRegion;
  city: string;
  establishedYear: number;
  websiteUrl?: string;
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  overview: string;
  totalFaculties: number;
  totalDepartments: number;
  totalPrograms: number;
  admissions?: AdmissionCutoff[];
  tuition?: TuitionFee[];
  facilities?: string[];
  scholarshipsAvailable?: number;
}
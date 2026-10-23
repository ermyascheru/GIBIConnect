export interface TuitionFee {
  id: string;
  institution_id: string | null;
  program_id: string | null;
  amount: string | null;
  currency: string | null;
  period: string | null;
  additional_fees: string | null;
  effective_date: string | null;
  last_verified_at: string | null;
  source: string | null;
  institution_name: string | null;
  program_name: string | null;
}

export interface TuitionFeeQuery {
  institutionId?: string;
  programId?: string;
  currency?: string;
  search?: string;
}

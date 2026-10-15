import type { TuitionFee, TuitionFeeQuery } from "../types/finance.types";
import {
  findAllTuitionFees,
  findTuitionFeeById,
} from "../repositories/finance.repository";

export const getTuitionFees = async (
  query: TuitionFeeQuery
): Promise<TuitionFee[]> => {
  return findAllTuitionFees(query);
};

export const getTuitionFeeById = async (
  id: string
): Promise<TuitionFee | null> => {
  return findTuitionFeeById(id);
};

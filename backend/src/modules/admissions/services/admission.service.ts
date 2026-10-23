import type { Admission, AdmissionQuery } from "../types/admission.types";
import {
  findAdmissionById,
  findAllAdmissions,
} from "../repositories/admission.repository";

export const getAdmissions = async (
  query: AdmissionQuery
): Promise<Admission[]> => {
  return findAllAdmissions(query);
};

export const getAdmissionById = async (
  id: string
): Promise<Admission | null> => {
  return findAdmissionById(id);
};

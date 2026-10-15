import {
  Institution,
  InstitutionQuery,
} from "../types/institution.types";
import {
  findAllInstitutions,
  findInstitutionById,
} from "../repositories/institution.repository";

export const getInstitutions = async (
  _query: InstitutionQuery
): Promise<Institution[]> => {
  return findAllInstitutions(_query);
};

export const getInstitutionById = async (
  id: string
): Promise<Institution | null> => {
  return findInstitutionById(id);
};
import type { Program, ProgramQuery } from "../types/program.types";
import {
  findAllPrograms,
  findProgramById,
} from "../repositories/program.repository";

export const getPrograms = async (
  query: ProgramQuery
): Promise<Program[]> => {
  return findAllPrograms(query);
};

export const getProgramById = async (
  id: string
): Promise<Program | null> => {
  return findProgramById(id);
};

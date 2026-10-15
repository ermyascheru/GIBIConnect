import type { Resource, ResourceQuery } from "../types/resource.types";
import {
  findAllResources,
  findResourceById,
} from "../repositories/resource.repository";

export const getResources = async (
  query: ResourceQuery
): Promise<Resource[]> => {
  return findAllResources(query);
};

export const getResourceById = async (
  id: string
): Promise<Resource | null> => {
  return findResourceById(id);
};

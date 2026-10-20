import type { UserProfile, UserQuery } from "../types/user.types";
import { findAllUsers, findUserById } from "../repositories/user.repository";

export const getUsers = async (
  query: UserQuery
): Promise<UserProfile[]> => {
  return findAllUsers(query);
};

export const getUserById = async (
  id: string
): Promise<UserProfile | null> => {
  return findUserById(id);
};

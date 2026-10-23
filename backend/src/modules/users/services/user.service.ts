import type { UserProfile, UserQuery } from "../types/user.types";
import { 
  findAllUsers, 
  findUserById,
  getUserBookmarks as fetchUserBookmarks,
  addInstitutionBookmark,
  removeInstitutionBookmark,
  addResourceBookmark,
  removeResourceBookmark,
} from "../repositories/user.repository";

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

export const getUserBookmarks = async (
  userId: string
): Promise<{ institutions: string[]; resources: string[] }> => {
  return fetchUserBookmarks(userId);
};

export const toggleBookmark = async (
  userId: string,
  type: "INSTITUTION" | "RESOURCE",
  itemId: string,
  action: "ADD" | "REMOVE"
): Promise<void> => {
  if (type === "INSTITUTION") {
    if (action === "ADD") {
      await addInstitutionBookmark(userId, itemId);
    } else {
      await removeInstitutionBookmark(userId, itemId);
    }
  } else {
    if (action === "ADD") {
      await addResourceBookmark(userId, itemId);
    } else {
      await removeResourceBookmark(userId, itemId);
    }
  }
};

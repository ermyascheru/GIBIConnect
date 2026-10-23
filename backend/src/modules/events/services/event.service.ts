import { AcademicEvent, EventQuery } from "../types/event.types";
import { findEvents, findEventById } from "../repositories/event.repository";

export const getEvents = async (query: EventQuery): Promise<AcademicEvent[]> => {
  return findEvents(query);
};

export const getEventById = async (id: string): Promise<AcademicEvent | null> => {
  return findEventById(id);
};

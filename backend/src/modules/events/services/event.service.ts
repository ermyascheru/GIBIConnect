import {
  findEventById,
  findEvents,
} from "../repositories/event.repository";
import type { EventQuery } from "../types/event.types";

export const getEvents = (query: EventQuery) => findEvents(query);

export const getEventById = (id: string) => findEventById(id);

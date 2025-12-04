import { EventRequest } from "app/models/events/events.interface";
import supabaseEventSdk from "../../sdk/event/supabase.event.sdk";

async function createEvent(eventRequest: EventRequest) {
  const response = await supabaseEventSdk.createEvent(eventRequest);
  return response;
}

async function getAllEvents() {
  const response = await supabaseEventSdk.getAllEvents();
  return response;
}

async function getEventById(eventId: string) {
  const response = await supabaseEventSdk.getEventById(eventId);
  return response;
}

async function deleteEventById(eventId: string) {
  const response = await supabaseEventSdk.deleteEventById(eventId);
  return response;
}

async function updateEventById(eventId: string, eventRequest: EventRequest) {
  const response = await supabaseEventSdk.updateEventById(
    eventId,
    eventRequest
  );
  return response;
}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEventById,
  updateEventById,
};

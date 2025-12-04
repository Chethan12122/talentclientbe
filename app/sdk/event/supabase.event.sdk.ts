import { EventRequest } from "../../models/events/events.interface";
import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";

async function createEvent(eventRequest: EventRequest) {
  const { data, error } = await supabase
    .from("events")
    .insert(eventRequest)
    .select();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data[0];
}

async function getAllEvents() {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function getEventById(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function deleteEventById(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function updateEventById(
  eventId: string,
  eventRequest: EventRequest
) {
  const { data, error } = await supabase
    .from("events")
    .update(eventRequest)
    .eq("id", eventId);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEventById,
  updateEventById,
};

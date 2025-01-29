import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import {
  InstituteRequest,
  VenueRequest,
} from "../../models/institute/institute.interface";

const createInstitute = async (instituteRequest: InstituteRequest) => {
  const { data, error } = await supabase
    .from("institutes")
    .insert([instituteRequest])
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
};

const getAllInstitutes = async () => {
  const { data, error } = await supabase.from("institutes").select("*");
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
};

const getInstituteById = async (instituteId: string) => {
  const { data, error } = await supabase
    .from("institutes")
    .select("*")
    .eq("institute_id", instituteId)
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
};

const deleteInstituteById = async (instituteId: string) => {
  const { data, error } = await supabase
    .from("institutes")
    .delete()
    .eq("institute_id", instituteId);
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
};

const getInstituteByName = async (instituteName: string) => {
  const { data } = await supabase
    .from("institutes")
    .select("*")
    .eq("name", instituteName)
    .single();
  return data;
};

const updateInstitute = async (
  instituteRequest: InstituteRequest,
  instituteId: string
) => {
  const { data, error } = await supabase
    .from("institutes")
    .update(instituteRequest)
    .eq("institute_id", instituteId)
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
};

const createVenue = async (venueRequest: VenueRequest) => {
  const { data, error } = await supabase
    .from("venue")
    .insert([venueRequest])
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
};

const getVenueById = async (venueId: string) => {
  const { data, error } = await supabase
    .from("venue")
    .select("*")
    .eq("id", venueId)
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
};

const getAllVenues = async () => {
  const { data, error } = await supabase.from("venue").select("*");
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
};

const updateVenue = async (venueRequest: VenueRequest, venueId: string) => {
  const { data, error } = await supabase
    .from("venue")
    .update(venueRequest)
    .eq("id", venueId)
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
};

const getInstituteByVenueId = async (venueId: string) => {
  const { data, error } = await supabase
    .from("institutes")
    .select("*")
    .eq("venue", venueId)
    .single();
  if (error) {
    return null;
  }
  return data;
};

const getUsersAssociatedWithInstitute = async (instituteId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("institute_id", instituteId);
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
};

export default {
  createInstitute,
  updateInstitute,
  getAllInstitutes,
  getInstituteById,
  deleteInstituteById,
  getInstituteByName,
  createVenue,
  getVenueById,
  getAllVenues,
  updateVenue,
  getInstituteByVenueId,
  getUsersAssociatedWithInstitute,
};

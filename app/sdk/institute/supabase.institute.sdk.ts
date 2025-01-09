import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { InstituteRequest } from "../../models/institute/institute.interface";

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

export default {
  createInstitute,
  getAllInstitutes,
  getInstituteById,
  deleteInstituteById,
  getInstituteByName,
  updateInstitute,
};

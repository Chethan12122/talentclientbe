/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstituteRequest } from "../../models/institute/institute.interface";
import supabaseInstituteSdk from "../../sdk/institute/supabase.institute.sdk";

const createOrUpdate = async (instituteRequest: InstituteRequest) => {
  const existingInstitute = await supabaseInstituteSdk.getInstituteByName(
    instituteRequest.name
  );
  let response: any;
  if (existingInstitute) {
    response = await supabaseInstituteSdk.updateInstitute(
      instituteRequest,
      existingInstitute.institute_id
    );
  } else {
    response = await supabaseInstituteSdk.createInstitute(instituteRequest);
  }
  return response;
};

const getAllInstitutes = async () => {
  const response = await supabaseInstituteSdk.getAllInstitutes();
  return response;
};

const getInstituteById = async (institute_id: string) => {
  const response = await supabaseInstituteSdk.getInstituteById(institute_id);
  return response;
};

const deleteInstituteById = async (institute_id: string) => {
  const response = await supabaseInstituteSdk.deleteInstituteById(institute_id);
  return response;
};

export default {
  createOrUpdate,
  getAllInstitutes,
  getInstituteById,
  deleteInstituteById,
};

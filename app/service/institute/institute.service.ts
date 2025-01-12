/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEAM_TYPE } from "../../common/enum";
import { InstituteRequest } from "../../models/institute/institute.interface";
import { TeamRequest } from "../../models/team/team.interface";
import supabaseInstituteSdk from "../../sdk/institute/supabase.institute.sdk";
import supabaseTeamSdk from "../../sdk/team/supabase.team.sdk";

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
    if (response && response.institute_id) {
      const teamRequests: TeamRequest[] = [
        {
          institute_id: response.institute_id,
          team_type: TEAM_TYPE.HIGH_PERFORMANCE,
        },
        {
          institute_id: response.institute_id,
          team_type: TEAM_TYPE.DEVELOPMENT,
        },
      ];
      await supabaseTeamSdk.createTeam(teamRequests);
    }
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

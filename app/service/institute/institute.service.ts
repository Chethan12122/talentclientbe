/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEAM_TYPE } from "../../common/enum";
import {
  InstituteRequest,
  VenueInstituteResponse,
  VenueRequest,
} from "../../models/institute/institute.interface";
import { TeamRequest } from "../../models/team/team.interface";
import supabaseInstituteSdk from "../../sdk/institute/supabase.institute.sdk";
import supabaseTeamSdk from "../../sdk/team/supabase.team.sdk";

const createInstitute = async (instituteRequest: InstituteRequest) => {
  const response = await supabaseInstituteSdk.createInstitute(instituteRequest);

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
  return response;
};

const updateInstitute = async (
  instituteRequest: InstituteRequest,
  institute_id: string
) => {
  const response = await supabaseInstituteSdk.updateInstitute(
    instituteRequest,
    institute_id
  );
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

const createVenue = async (venueRequest: VenueRequest) => {
  const response = await supabaseInstituteSdk.createVenue(venueRequest);
  return response;
};

const getAllVenues = async () => {
  const response = await supabaseInstituteSdk.getAllVenues();
  return response;
};

const getVenueById = async (venue_id: string) => {
  const response = await supabaseInstituteSdk.getVenueById(venue_id);
  return response;
};

const updateVenue = async (venueRequest: VenueRequest, venue_id: string) => {
  const response = await supabaseInstituteSdk.updateVenue(
    venueRequest,
    venue_id
  );
  return response;
};

async function getInstituteByVenueId(venue_id: string) {
  const response = await supabaseInstituteSdk.getInstituteByVenueId(venue_id);
  return response;
}

const getAllVenuesByInstituteIds = async () => {
  const allVenues = await getAllVenues();

  const venueInstituteResponse: VenueInstituteResponse[] = await Promise.all(
    allVenues.map(async (venue) => {
      const institute = await getInstituteByVenueId(venue.id);
      return {
        venue_id: venue.id,
        institute_id: institute ? institute.institute_id : null,
      };
    })
  );

  return venueInstituteResponse;
};

export default {
  createInstitute,
  updateInstitute,
  getAllInstitutes,
  getInstituteById,
  deleteInstituteById,
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  getAllVenuesByInstituteIds,
};

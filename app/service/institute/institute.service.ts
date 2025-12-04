/* eslint-disable @typescript-eslint/no-explicit-any */
import supabaseDistrictSdk from "../../sdk/district/supabase.district.sdk";
import {
  InstituteDistrictResponse,
  InstituteRequest,
  VenueInstituteResponse,
  VenueRequest,
} from "../../models/institute/institute.interface";
import supabaseInstituteSdk from "../../sdk/institute/supabase.institute.sdk";

const createInstitute = async (instituteRequest: InstituteRequest) => {
  const { name } = instituteRequest;
  const response = await supabaseInstituteSdk.createInstitute({
    name,
    district_id: instituteRequest.district_id,
  });

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
  const allInstitutes = await supabaseInstituteSdk.getAllInstitutes();

  const response: any[] = await Promise.all(
    allInstitutes.map(async (institute: InstituteDistrictResponse) => ({
      ...institute,
      district_details: institute.institute_id
        ? await supabaseDistrictSdk.getDistrictById(institute.district_id)
        : null,
    }))
  );

  return response;
};

const getInstituteById = async (institute_id: string) => {
  const institute_details =
    await supabaseInstituteSdk.getInstituteById(institute_id);

  return {
    ...institute_details,
    users_associated: await getUsersAssociatedWithInstitute(institute_id),
    district_details: await supabaseDistrictSdk.getDistrictById(
      institute_details.district_id
    ),
  };
};

const getUsersAssociatedWithInstitute = async (institute_id: string) => {
  const response =
    await supabaseInstituteSdk.getUsersAssociatedWithInstitute(institute_id);
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

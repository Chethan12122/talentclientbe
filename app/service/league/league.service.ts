import supabaseInstituteSdk from "../../sdk/institute/supabase.institute.sdk";
import { GROUPS } from "../../common/constants";
import {
  LeagueGroupMappingResponse,
  LeagueRequest,
} from "../../models/league/league.interface";
import supabaseLeagueSdk from "../../sdk/league/supabase.league.sdk";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import {
  InstitueGroupResponse,
  InstituteDistrictResponse,
} from "../../models/institute/institute.interface";
import supabaseDistrictSdk from "../../sdk/district/supabase.district.sdk";

async function createLeague(leagueRequest: LeagueRequest, userId: string) {
  const response = await supabaseLeagueSdk.createLeague(leagueRequest, userId);
  return response;
}

async function getAllLeagues() {
  const response = await supabaseLeagueSdk.getAllLeagues();
  const leaguesWithDistricts = await Promise.all(
    response.map(async (league) => {
      const district_details = league.district_id
        ? await supabaseDistrictSdk.getDistrictById(league.district_id)
        : null;

      return {
        ...league,
        district_details,
      };
    })
  );

  return leaguesWithDistricts;
}

async function getLeagueById(id: string) {
  const response = await supabaseLeagueSdk.getLeagueById(id);
  return response;
}

async function updateLeague(
  id: string,
  leagueRequest: LeagueRequest,
  userId: string
) {
  const response = await supabaseLeagueSdk.updateLeague(
    id,
    leagueRequest,
    userId
  );
  return response;
}

export async function createGroupsAndAssignInstitutes(leagueId: string) {
  const leagueDetails = await supabaseLeagueSdk.getLeagueById(leagueId);

  const districtId = leagueDetails.district_id;

  if (!districtId) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.INSTITUTION_ASSIGNEMENT_FAILURE(
        "District not found"
      )
    );
  }

  // Step 1: Create group mappings
  const groupsResponse: LeagueGroupMappingResponse[] =
    await supabaseLeagueSdk.createGroupsAndLeagueMappings(
      leagueId,
      Object.values(GROUPS)
    );

  const createdGroups = groupsResponse;

  // // Step 2: Fetch institutes
  const institutesResponse: InstituteDistrictResponse[] =
    await supabaseInstituteSdk.getInstitutesByDistrictId(districtId);

  if (institutesResponse.length === 0) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.INSTITUTION_ASSIGNEMENT_FAILURE(
        "Institutes not found"
      )
    );
  }

  const shuffledInstitutes = [...institutesResponse].sort(
    () => Math.random() - 0.5
  );

  // Step 4: Evenly assign institutes to 4 groups
  const assignments: InstitueGroupResponse[] = [];
  for (let i = 0; i < shuffledInstitutes.length; i++) {
    const group = createdGroups[i % createdGroups.length]; // round-robin
    assignments.push({
      group_id: group.id,
      institute_id: shuffledInstitutes[i].institute_id,
    });
  }

  // Step 5: Save assignments
  const saveResponse =
    await supabaseInstituteSdk.insertInstituteGroupAssignments(assignments);

  return saveResponse;
}

export async function getAllGroupsAndInstitutes(leagueId: string) {
  // Step 1: Fetch all groups for the given league
  const groupsResponse: LeagueGroupMappingResponse[] =
    await supabaseLeagueSdk.getGroupsByLeagueId(leagueId);

  if (!groupsResponse || groupsResponse.length === 0) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.INSTITUTION_ASSIGNEMENT_FAILURE(
        "No groups found for given league"
      )
    );
  }

  // Step 2: Fetch all institute-group assignments for these groups
  const groupIds = groupsResponse.map((group) => group.id);
  const instituteAssignments: InstitueGroupResponse[] =
    await supabaseInstituteSdk.getInstituteGroupAssignments(groupIds);

  // Step 3: Fetch institute details for assigned institutes
  const instituteIds = instituteAssignments.map(
    (assignment) => assignment.institute_id
  );
  const institutes: InstituteDistrictResponse[] =
    await supabaseInstituteSdk.getInstitutesByIds(instituteIds);

  // Step 4: Combine data — groups with assigned institutes
  const result = await Promise.all(
    groupsResponse.map(async (group) => {
      const assignedInstitutes = await Promise.all(
        instituteAssignments
          .filter((a) => a.group_id === group.id)
          .map(async (a) => {
            const institute = institutes.find(
              (i) => i.institute_id === a.institute_id
            );

            const district_details = institute?.district_id
              ? await supabaseDistrictSdk.getDistrictById(institute.district_id)
              : null;

            return {
              institute_id: institute?.institute_id,
              name: institute?.name,
              district_id: institute?.district_id,
              district_details,
            };
          })
      );

      return {
        group_id: group.id,
        group_name: group.group,
        league_id: group.league_id,
        institutes: assignedInstitutes,
      };
    })
  );

  return {
    success: true,
    league_id: leagueId,
    groups: result,
  };
}

export async function scheduleLeagueGroupTimes(
  lgroupId: string,
  scheduledTime: string
) {
  const response = await supabaseLeagueSdk.scheduleLeagueGroupTimes(
    lgroupId,
    scheduledTime
  );
  return response;
}

export default {
  createLeague,
  getAllLeagues,
  getLeagueById,
  updateLeague,
  createGroupsAndAssignInstitutes,
  getAllGroupsAndInstitutes,
  scheduleLeagueGroupTimes,
};

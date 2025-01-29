/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEAM_TYPE } from "../../common/enum";
import { TeamRequest } from "../../models/team/team.interface";
import supabaseSdk from "../../sdk/team/supabase.team.sdk";
import instituteService from "../institute/institute.service";
import { ApplicationStaticErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { Athlete } from "../../models/fixtures/fixtures.interface";

async function create(teamRequest: TeamRequest) {
  const updatedTeamRequest: TeamRequest[] = [
    {
      institute_id: teamRequest.institute_id,
      team_type: TEAM_TYPE.HIGH_PERFORMANCE,
    },
    {
      institute_id: teamRequest.institute_id,
      team_type: TEAM_TYPE.DEVELOPMENT,
    },
  ];
  const response = await supabaseSdk.createTeam(updatedTeamRequest);
  return response;
}

async function getAllTeams(filter_team_type: string) {
  const allTeams = await supabaseSdk.getAllTeams(filter_team_type);
  const teamsWithDetails = await Promise.all(
    allTeams.map(async (team) => {
      let instituteDetails = await instituteService.getInstituteById(
        team.institute_id
      );
      instituteDetails = {
        ...instituteDetails,
        venue_details: instituteDetails.venue
          ? await instituteService.getVenueById(instituteDetails.venue)
          : null,
      };
      return { ...team, instituteDetails };
    })
  );
  return teamsWithDetails;
}

async function getTeamById(teamId: string) {
  const team_details = await supabaseSdk.getTeamById(teamId);
  return {
    ...team_details,
    instituteDetails: team_details.institute_id
      ? await instituteService.getInstituteById(team_details.institute_id)
      : null,
    users_associated: await getUsersAssociatedWithTeam(teamId),
  };
}

async function getUsersAssociatedWithTeam(teamId: string) {
  const response = await supabaseSdk.getUsersAssociatedWithTeam(teamId);
  return response;
}

async function deleteTeamById(teamId: string) {
  const response = await supabaseSdk.deleteTeamById(teamId);
  return response;
}

async function update(teamId: string, teamRequest: TeamRequest) {
  const response = await supabaseSdk.updateTeam(teamId, teamRequest);
  return response;
}

async function addUserToTeam(
  teamId: string,
  userId: string,
  requestType: string
) {
  if (requestType.toUpperCase() !== "REMOVE") {
    const team_details = await getTeamById(teamId);
    if (!team_details) {
      throw new NonRetryableException(ApplicationStaticErrors.TEAM_NOT_FOUND);
    }

    const users_associated_with_institute: Athlete[] =
      team_details.instituteDetails.users_associated;

    if (
      !users_associated_with_institute.some((user) => user.user_id === userId)
    ) {
      throw new NonRetryableException(
        ApplicationStaticErrors.USER_NOT_ASSOCIATED_WITH_INSTITUTE
      );
    }
  }

  const response = await supabaseSdk.addUserToTeam(teamId, userId);
  return response;
}

export default {
  create,
  getAllTeams,
  getTeamById,
  deleteTeamById,
  update,
  addUserToTeam,
};

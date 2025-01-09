/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEAM_TYPE } from "../../common/enum";
import { TeamRequest } from "../../models/team/team.interface";
import supabaseSdk from "../../sdk/team/supabase.team.sdk";

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
  const response = await supabaseSdk.getAllTeams(filter_team_type);
  return response;
}

async function getTeamById(teamId: string) {
  const response = await supabaseSdk.getTeamById(teamId);
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

export default { create, getAllTeams, getTeamById, deleteTeamById, update };

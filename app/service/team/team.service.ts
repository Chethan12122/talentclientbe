/* eslint-disable @typescript-eslint/no-explicit-any */
import { TeamRequest } from "../../models/team/team.interface";
import supabaseSdk from "../../sdk/team/supabase.team.sdk";

async function create(teamRequest: TeamRequest) {
  const response = await supabaseSdk.createTeam(teamRequest);
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

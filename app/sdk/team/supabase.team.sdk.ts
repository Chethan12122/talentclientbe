import { TEAM_TYPE } from "../../common/enum";
import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { TeamRequest } from "../../models/team/team.interface";

async function createTeam(teamRequest: TeamRequest) {
  const { data, error } = await supabase
    .from("teams")
    .insert([
      {
        team_name: teamRequest.team_name,
        institute_name: teamRequest.institute_name,
        team_type: teamRequest.team_type,
        team_venue: teamRequest.team_venue,
      },
    ])
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
}

async function getAllTeams(filter_team_type: string) {
  // Start building the query
  let query = supabase.from("teams").select("*");

  // Add filter condition if filter_team_type is not empty or null
  if (filter_team_type) {
    if (
      filter_team_type === TEAM_TYPE.HIGH_PERFORMANCE ||
      filter_team_type === TEAM_TYPE.DEVELOPMENT
    ) {
      query = query.eq("team_type", filter_team_type);
    }
  }

  // Execute the query
  const { data, error } = await query;

  // Handle error
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }

  // Return the result
  return data;
}

async function getTeamById(id: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("team_id", id);

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
}

async function deleteTeamById(id: string) {
  const { data, error } = await supabase
    .from("teams")
    .delete()
    .eq("team_id", id);

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
}

async function updateTeam(id: string, teamRequest: TeamRequest) {
  const { data, error } = await supabase
    .from("teams")
    .update([
      {
        team_name: teamRequest.team_name,
        institute_name: teamRequest.institute_name,
        team_type: teamRequest.team_type,
        team_venue: teamRequest.team_venue,
      },
    ])
    .eq("team_id", id);

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
}

export default {
  createTeam,
  getAllTeams,
  getTeamById,
  deleteTeamById,
  updateTeam,
};

import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { LeagueRequest } from "../../models/league/league.interface";
import { supabase } from "../../common/supabase";
import supabaseDistrictSdk from "../district/supabase.district.sdk";

const createLeague = async (leagueRequest: LeagueRequest, userId: string) => {
  const payload = {
    ...leagueRequest,
    start_date: new Date(leagueRequest.start_date).toISOString(),
    end_date:
      leagueRequest.end_date && new Date(leagueRequest.end_date).toISOString(),
    created_by: userId,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("leagues")
    .insert([payload])
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

const getAllLeagues = async () => {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .order("start_date", { ascending: true });

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

async function getLeagueById(leagueId: string) {
  // Step 1: Fetch league details
  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("*")
    .eq("league_id", leagueId)
    .single();

  if (leagueError) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        leagueError.message,
        500,
        leagueError.code || ""
      )
    );
  }

  if (!league) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        "League not found",
        404,
        "NOT_FOUND"
      )
    );
  }

  // Step 2: Fetch all groups for the league
  const { data: groups, error: groupsError } = await supabase
    .from("league_group_mappings")
    .select("id, group, scheduled_datetime")
    .eq("league_id", leagueId);

  if (groupsError) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        groupsError.message,
        500,
        groupsError.code || ""
      )
    );
  }

  // Step 3: For each group, fetch associated institutes
  const groupsWithInstitutes = await Promise.all(
    (groups || []).map(async (group) => {
      const { data: institutes, error: institutesError } = await supabase
        .from("institute_group_assignments")
        .select(
          `
          id,
          institute_id,
          institutes (
            institute_id,
            name
          )
        `
        )
        .eq("group_id", group.id);

      if (institutesError) {
        throw new NonRetryableException(
          ApplicationDynamicErrors.SDK_API_ERROR(
            institutesError.message,
            500,
            institutesError.code || ""
          )
        );
      }

      return {
        ...group,
        institutes: institutes?.map((i) => i.institutes) || [],
      };
    })
  );

  // Step 4: Fetch district details (if available)
  const district_details = league.district_id
    ? await supabaseDistrictSdk.getDistrictById(league.district_id)
    : null;

  // Step 5: Final structured response
  return {
    ...league,
    district_details,
    groups: groupsWithInstitutes,
  };
}

const updateLeague = async (
  id: string,
  leagueRequest: LeagueRequest,
  userId: string
) => {
  const { data, error } = await supabase
    .from("leagues")
    .update({
      ...leagueRequest,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("league_id", id)
    .select()
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

const createGroupsAndLeagueMappings = async (id: string, groups: string[]) => {
  const { data, error } = await supabase
    .from("league_group_mappings")
    .insert(groups.map((group) => ({ group: group, league_id: id })))
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
  return data;
};

const getGroupsByLeagueId = async (id: string) => {
  const { data, error } = await supabase
    .from("league_group_mappings")
    .select("*")
    .eq("league_id", id);
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

const scheduleLeagueGroupTimes = async (id: string, scheduledTime: string) => {
  const { data, error } = await supabase
    .from("league_group_mappings")
    .update({ scheduled_datetime: scheduledTime })
    .eq("id", id)
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
  return data;
};

export default {
  createLeague,
  getAllLeagues,
  getLeagueById,
  updateLeague,
  createGroupsAndLeagueMappings,
  getGroupsByLeagueId,
  scheduleLeagueGroupTimes,
};

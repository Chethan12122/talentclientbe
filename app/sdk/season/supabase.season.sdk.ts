import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { SeasonRequest } from "../../models/season/season.interface";

async function createSeason(seasonRequest: SeasonRequest, seasonName: string) {
  const { data, error } = await supabase
    .from("seasons")
    .insert([
      {
        season_name: seasonName,
        start_date: new Date(seasonRequest.start_date),
        end_date: new Date(seasonRequest.end_date),
        break_start_date:
          seasonRequest.break_start_date !== undefined
            ? new Date(seasonRequest.break_start_date)
            : null,
        break_end_date:
          seasonRequest.break_end_date !== undefined
            ? new Date(seasonRequest.break_end_date)
            : null,
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

async function getSeasonByName(seasonName: string) {
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("season_name", seasonName)
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
}

async function updateSeason(seasonRequest: SeasonRequest, seasonId: string) {
  const { data, error } = await supabase
    .from("seasons")
    .update({
      start_date: new Date(seasonRequest.start_date),
      end_date: new Date(seasonRequest.end_date),
      break_start_date:
        seasonRequest.break_start_date !== undefined
          ? new Date(seasonRequest.break_start_date)
          : null,
      break_end_date:
        seasonRequest.break_end_date !== undefined
          ? new Date(seasonRequest.break_end_date)
          : null,
    })
    .eq("season_id", seasonId)
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

async function getAllSeasons() {
  const { data, error } = await supabase.from("seasons").select("*");

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

async function getSeasonById(seasonId: string) {
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("season_id", seasonId)
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
}

async function getCurrentSeason(date: string) {
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .filter("start_date", "lte", date)
    .filter("end_date", "gte", date);

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

export default {
  createSeason,
  getSeasonByName,
  updateSeason,
  getAllSeasons,
  getSeasonById,
  getCurrentSeason,
};

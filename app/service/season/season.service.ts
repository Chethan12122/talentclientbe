/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SeasonRequest,
  SeasonResponse,
} from "../../models/season/season.interface";
import supabaseSdk from "../../sdk/season/supabase.season.sdk";

async function createOrUpdate(seasonRequest: SeasonRequest) {
  const season_name = computeSeasonName(seasonRequest.start_date);
  const existingSeason = await supabaseSdk.getSeasonByName(season_name);
  let response: any;
  if (existingSeason) {
    response = await supabaseSdk.updateSeason(
      seasonRequest,
      existingSeason.season_id
    );
  } else {
    response = await supabaseSdk.createSeason(seasonRequest, season_name);
  }
  return response;
}

function computeSeasonName(startDate: Date) {
  const date = new Date(startDate);
  const year = date.getFullYear();
  return `${year}-${year + 1}`;
}

async function getAllSeasons() {
  const response = await supabaseSdk.getAllSeasons();
  return response;
}

async function getSeasonByName(season_name: string) {
  const response = await supabaseSdk.getSeasonByName(season_name);
  return response;
}

async function getSeasonById(season_id: string) {
  const response = await supabaseSdk.getSeasonById(season_id);
  return response;
}

async function getCurrentSeason(): Promise<SeasonResponse> {
  let date = new Date().toISOString().split("T")[0]; // Formatting to "YYYY-MM-DD HH:MM:SS"
  const response = await supabaseSdk.getCurrentSeason(date); // Corrected function call
  return response;
}

export default {
  createOrUpdate,
  getAllSeasons,
  getSeasonByName,
  getSeasonById,
  getCurrentSeason,
};

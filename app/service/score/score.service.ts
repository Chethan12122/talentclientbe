import { ScoreRequest } from "../../models/score/score.interface";
import supabaseSdk from "../../sdk/score/supabase.score.sdk";

async function create(scoreRequest: ScoreRequest) {
  const response = await supabaseSdk.createScore(scoreRequest);
  return response;
}

async function getAllScores(fixture_id: string) {
  const response = await supabaseSdk.getAllScores(fixture_id);
  return response;
}

async function getScoreById(score_id: string) {
  const response = await supabaseSdk.getScoreById(score_id);
  return response;
}

async function updateScoreById(score_id: string, scoreRequest: ScoreRequest) {
  const response = await supabaseSdk.updateScoreById(score_id, scoreRequest);
  return response;
}

export default { create, getAllScores, getScoreById, updateScoreById };

import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import { ScoreRequest } from "../../models/score/score.interface";

const createScore = async (scoreRequest: ScoreRequest) => {
  const { data, error } = await supabase
    .from("scores")
    .insert([scoreRequest])
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

const getAllScores = async (fixture_id: string) => {
  let query = supabase.from("scores").select("*");

  if (fixture_id) {
    query = query.eq("fixture_id", fixture_id);
  }

  const { data, error } = await query;
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

const getScoreById = async (scoreId: string) => {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("score_id", scoreId)
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

const updateScoreById = async (scoreId: string, scoreRequest: ScoreRequest) => {
  const { data, error } = await supabase
    .from("scores")
    .update(scoreRequest)
    .eq("score_id", scoreId);
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

export default { createScore, getAllScores, getScoreById, updateScoreById };

import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";
import {
  GameCategoryRequest,
  GameRequest,
} from "../../models/game/game.interface";

async function createGame(gameRequest: GameRequest) {
  const { data, error } = await supabase
    .from("games")
    .insert(gameRequest)
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

async function getAllGames() {
  const { data, error } = await supabase.from("games").select("*");
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

async function getGameById(gameId: string) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("game_id", gameId)
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

async function deleteGameById(gameId: string) {
  const { data, error } = await supabase
    .from("games")
    .delete()
    .eq("game_id", gameId);
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

async function createGameCategory(gameCategoryRequest: GameCategoryRequest) {
  const { data, error } = await supabase
    .from("game_categories")
    .insert(gameCategoryRequest)
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

async function getGameCategoryById(gameCategoryId: string) {
  const { data, error } = await supabase
    .from("game_categories")
    .select("*")
    .eq("category_id", gameCategoryId)
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

async function deleteGameCategoryById(gameCategoryId: string) {
  const { data, error } = await supabase
    .from("game_categories")
    .delete()
    .eq("category_id", gameCategoryId);
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

async function getAllGameCategories() {
  const { data, error } = await supabase.from("game_categories").select("*");
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
  createGame,
  getAllGames,
  getGameById,
  deleteGameById,
  createGameCategory,
  getGameCategoryById,
  deleteGameCategoryById,
  getAllGameCategories,
};

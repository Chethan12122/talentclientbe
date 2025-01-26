import {
  GameCategoryRequest,
  GameRequest,
} from "../../models/game/game.interface";
import supabaseGameSdk from "../../sdk/game/supabase.game.sdk";

async function createGame(gameRequest: GameRequest) {
  const response = await supabaseGameSdk.createGame(gameRequest);
  return response;
}

async function getAllGames() {
  const response = await supabaseGameSdk.getAllGames();
  return response;
}

async function getGameById(game_id: string) {
  const response = await supabaseGameSdk.getGameById(game_id);
  return response;
}

async function deleteGameById(game_id: string) {
  const response = await supabaseGameSdk.deleteGameById(game_id);
  return response;
}

async function createGameCategory(gameCategoryRequest: GameCategoryRequest) {
  const response =
    await supabaseGameSdk.createGameCategory(gameCategoryRequest);
  return response;
}

async function getGameCategoryById(game_id: string) {
  const response = await supabaseGameSdk.getGameCategoryById(game_id);
  return response;
}

async function deleteGameCategoryById(game_id: string) {
  const response = await supabaseGameSdk.deleteGameCategoryById(game_id);
  return response;
}

async function getAllGameCategories(game_id: string) {
  const response = await supabaseGameSdk.getAllGameCategories(game_id);
  return response;
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

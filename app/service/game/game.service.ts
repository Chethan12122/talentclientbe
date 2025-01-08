import { GameRequest } from "../../models/game/game.interface";
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

export default { createGame, getAllGames, getGameById, deleteGameById };

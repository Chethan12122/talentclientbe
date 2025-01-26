import { GAME_CATEGORY_TYPE } from "../../common/enum";

export interface GameRequest {
  game_name: string;
}

export interface GameCategoryRequest {
  game_id: string;
  game_category_name: string;
  type: GAME_CATEGORY_TYPE;
}

export interface GameCategoryResponse {
  game_id: string;
  game_category_name: string;
  type: GAME_CATEGORY_TYPE;
  category_id: string;
}

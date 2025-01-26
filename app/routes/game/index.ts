import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  create,
  getAllGames,
  getGameById,
  deleteGameById,
} from "./game.routes";
import { validateGameRequest } from "../../validator/game.validator";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateGameRequest, create)
  .get(verifyToken, getAllGames)
  .all(methodNotAllowed);

router
  .route("/:game_id")
  .get(verifyToken, getGameById)
  .delete(verifyToken, deleteGameById)
  .all(methodNotAllowed);
export default router;

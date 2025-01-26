import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  create,
  getAllGameCategories,
  getGameCategoryById,
  deleteGameCategoryById,
} from "./game_category.routes";
import { validateGameCategoryRequest } from "../../validator/game.validator";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateGameCategoryRequest, create)
  .get(verifyToken, getAllGameCategories)
  .all(methodNotAllowed);

router
  .route("/:category_id")
  .get(verifyToken, getGameCategoryById)
  .delete(verifyToken, deleteGameCategoryById)
  .all(methodNotAllowed);

export default router;

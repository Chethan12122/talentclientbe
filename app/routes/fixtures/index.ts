import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  generateFixturesForGameCategory,
  generateFixturesForGame,
  getFixturesForCategoryAndSeason,
} from "./fixtures.routes";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/generateForGameCategory")
  .post(verifyToken, generateFixturesForGameCategory)
  .all(methodNotAllowed);

router
  .route("/generateForGame")
  .post(verifyToken, generateFixturesForGame)
  .all(methodNotAllowed);

router
  .route("/")
  .get(verifyToken, getFixturesForCategoryAndSeason)
  .all(methodNotAllowed);

export default router;

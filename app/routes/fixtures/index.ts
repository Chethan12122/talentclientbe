import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  generateFixturesForGameCategory,
  generateFixturesForGame,
  getFixturesForCategoryAndSeason,
  manualFixtureCreation,
  updateFixture,
  getFixtureById,
} from "./fixtures.routes";
import { verifyToken } from "../auth/auth.routes";
import { validateManualFixtureRequest } from "../../validator/fixture.validator";
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
  .post(verifyToken, validateManualFixtureRequest, manualFixtureCreation)
  .put(verifyToken, updateFixture)
  .all(methodNotAllowed);

router
  .route("/id/:fixture_id")
  .get(verifyToken, getFixtureById)
  .all(methodNotAllowed);

export default router;

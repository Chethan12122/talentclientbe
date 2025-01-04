import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { create, getAllSeasons, getSeasonByName } from "./season.routes";
import { validateSeasonRequest } from "../../validator/season.validator";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateSeasonRequest, create)
  .get(verifyToken, getAllSeasons)
  .all(methodNotAllowed);

router
  .route("/:season_name")
  .get(verifyToken, getSeasonByName)
  .all(methodNotAllowed);
export default router;

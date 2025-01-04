import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { create, getAllSeasons, getSeasonByName } from "./season.routes";
import { validateSeasonRequest } from "../../validator/season.validator";
const router = express.Router({});

router
  .route("/")
  .post(validateSeasonRequest, create)
  .get(getAllSeasons)
  .all(methodNotAllowed);

router
  .route("/:season_name")
  .get(getSeasonByName)
  .all(methodNotAllowed);
export default router;

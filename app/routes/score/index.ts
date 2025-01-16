import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { verifyToken } from "../auth/auth.routes";
import { create, getAllScores, getScoreById, update } from "./score.routes";
import { validateScoreRequest } from "../../validator/scores.validator";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateScoreRequest, create)
  .get(verifyToken, getAllScores)
  .all(methodNotAllowed);

router
  .route("/:score_id")
  .get(verifyToken, getScoreById)
  .put(verifyToken, update)
  .all(methodNotAllowed);
export default router;

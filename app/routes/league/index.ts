import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { verifyToken } from "../auth/auth.routes";
import {
  createGroupsAndAssignInstitues,
  createLeague,
  getAllGroupsAndInstitutes,
  getAllLeagues,
  getLeagueById,
  scheduleLeagueGroupTimes,
  updateLeague,
} from "./league.routes";
import { validateLeagueRequest } from "../../validator/league.validator";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateLeagueRequest, createLeague)
  .get(verifyToken, getAllLeagues)
  .all(methodNotAllowed);

router
  .route("/:id")
  .get(verifyToken, getLeagueById)
  .put(verifyToken, validateLeagueRequest, updateLeague)
  .all(methodNotAllowed);


router
  .route("/:id/group")
  .post(verifyToken, createGroupsAndAssignInstitues)
  .get(getAllGroupsAndInstitutes)
  .all(methodNotAllowed);

router
  .route("/:lgroupId/schedule")
  .patch(verifyToken, scheduleLeagueGroupTimes)
  .all(methodNotAllowed);

export default router;

import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  create,
  getAllTeams,
  getTeamById,
  deleteTeamById,
  update,
  addUserToTeam,
} from "./team.routes";
import { validateTeamRequest } from "../../validator/team.validator";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateTeamRequest, create)
  .get(verifyToken, getAllTeams)
  .all(methodNotAllowed);

router
  .route("/:team_id")
  .get(verifyToken, getTeamById)
  .put(verifyToken, validateTeamRequest, update)
  .delete(verifyToken, deleteTeamById)
  .all(methodNotAllowed);

router
  .route("/:team_id/user/:user_id")
  .post(verifyToken, addUserToTeam)
  .all(methodNotAllowed);

export default router;

import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { generateFixtures, getFixturesForCategory } from "./fixtures.routes";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/generate")
  .post(verifyToken, generateFixtures)
  .all(methodNotAllowed);

router
  .route("/")
  .get(verifyToken, getFixturesForCategory)
  .all(methodNotAllowed);

export default router;

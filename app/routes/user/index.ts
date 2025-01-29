import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { verifyToken } from "../auth/auth.routes";
import {
  addGameCategoryForUser,
  getAllUsers,
  getUserById,
  refereshUserInfoFromExcel,
} from "./user.routes";
const router = express.Router({});

router.route("/").get(verifyToken, getAllUsers).all(methodNotAllowed);

router.route("/:id").get(verifyToken, getUserById).all(methodNotAllowed);

router
  .route("/sync/sheet")
  .post(verifyToken, refereshUserInfoFromExcel)
  .all(methodNotAllowed);

router
  .route("/:id/game_category/:game_category_id")
  .post(verifyToken, addGameCategoryForUser)
  .all(methodNotAllowed);
export default router;

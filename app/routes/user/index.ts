import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { verifyToken } from "../auth/auth.routes";
import {
  getAllUsers,
  getUserById,
  refereshUserInfoFromExcel,
} from "./user.routes";
const router = express.Router({});

router.route("/").get(verifyToken, getAllUsers).all(methodNotAllowed);

router
  .route("/:id")
  .get(verifyToken, getUserById)
  //   .put(verifyToken, validateUserUpdateRequest, updateUser) :- to be added
  .all(methodNotAllowed);

router
  .route("/sync/sheet")
  .post(verifyToken, refereshUserInfoFromExcel)
  .all(methodNotAllowed);
export default router;

import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { verifyToken } from "../auth/auth.routes";
import { getAllUsers, getUserById } from "./user.routes";
const router = express.Router({});

router.route("/").get(verifyToken, getAllUsers).all(methodNotAllowed);

router
  .route("/:user_id")
  .get(verifyToken, getUserById)
  //   .put(verifyToken, validateUserUpdateRequest, updateUser) :- to be added
  .all(methodNotAllowed);
export default router;

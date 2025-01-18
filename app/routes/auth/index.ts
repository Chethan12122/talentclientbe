import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  login,
  logout,
  refreshToken,
  register,
  verify,
  verifyToken,
} from "./auth.routes";
import {
  validateUserLoginRequest,
  validateUserRegisterRequest,
  validateUserVerifyRequest,
} from "../../validator/user.validator";
const router = express.Router({});

router
  .route("/register")
  .post(validateUserRegisterRequest, register)
  .all(methodNotAllowed);

router
  .route("/verify")
  .post(validateUserVerifyRequest, verify)
  .all(methodNotAllowed);

router
  .route("/login")
  .post(validateUserLoginRequest, login)
  .all(methodNotAllowed);

router.route("/refresh").post(verifyToken, refreshToken).all(methodNotAllowed);

router.route("/logout").post(verifyToken, logout).all(methodNotAllowed);

// router.route("/verifyToken").get(getLoginStatus).all(methodNotAllowed);

export default router;

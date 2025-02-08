import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
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

router.route("/refresh").post(refreshToken).all(methodNotAllowed);

router.route("/logout").post(verifyToken, logout).all(methodNotAllowed);

router.route("/forgot-password").post(forgotPassword).all(methodNotAllowed);

router
  .route("/reset-password")
  .post(verifyToken, resetPassword)
  .all(methodNotAllowed);

export default router;

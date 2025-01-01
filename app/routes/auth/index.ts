import express from 'express';
import { methodNotAllowed } from '../../common/utils/common.utils';
import { getLoginStatus, login, logout, register, verify} from './auth.routes'
import { validateUserLoginRequest, validateUserRegisterRequest, validateUserVerifyRequest } from '../../validator/user.validator';
const router = express.Router({});

router.route("/register").post(validateUserRegisterRequest, register).all(methodNotAllowed);

router.route("/verify").post(validateUserVerifyRequest, verify).all(methodNotAllowed);

router.route("/login").post(validateUserLoginRequest, login).all(methodNotAllowed);

router.route("/logout").post(logout).all(methodNotAllowed);

router.route("/login-status").get(getLoginStatus).all(methodNotAllowed);

export default router;
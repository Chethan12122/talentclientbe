import express from 'express';
import { methodNotAllowed } from '../../common/utils/common.utils';
import { register} from './auth.routes'
import { validateUserRegisterRequest } from '../../validator/user.validator';
const router = express.Router({});

router.route("/register").post(validateUserRegisterRequest, register).all(methodNotAllowed)

export default router;
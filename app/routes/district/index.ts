import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  create,
  getAll,
  getById,
  update,
  deleteById

} from "./district.routes";
import { validateDistrictRequest} from "../../validator/district.validator";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateDistrictRequest, create)
  .get(getAll)
  .all(methodNotAllowed);

router
  .route("/:district_id")
  .get(verifyToken, getById)
  .put(verifyToken, validateDistrictRequest, update)
  .delete(verifyToken, deleteById)
  .all(methodNotAllowed);

export default router;

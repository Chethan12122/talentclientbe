import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  createInstitute,
  getAllInstitutes,
  getInstituteById,
  deleteInstituteById,
  updateInstitute,
} from "./institute.routes";
import { validateInstituteRequest } from "../../validator/institute.validator";
import { verifyToken } from "../auth/auth.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateInstituteRequest, createInstitute)
  .get(verifyToken, getAllInstitutes)
  .all(methodNotAllowed);

router
  .route("/:institute_id")
  .get(verifyToken, getInstituteById)
  .delete(verifyToken, deleteInstituteById)
  .put(verifyToken, updateInstitute)
  .all(methodNotAllowed);

export default router;

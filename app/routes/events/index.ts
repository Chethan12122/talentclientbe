import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import {
  create,
  getAll,
  getById,
  update,
  deleteById

} from "./events.routes";
import { verifyToken } from "../auth/auth.routes";
import { validateEventRequest } from "../../validator/event.validator";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateEventRequest, create)
  .get( getAll)
  .all(methodNotAllowed);

router
  .route("/:event_id")
  .get(verifyToken, getById)
  .put(verifyToken, validateEventRequest, update)
  .delete(verifyToken,deleteById)
  .all(methodNotAllowed);

export default router;

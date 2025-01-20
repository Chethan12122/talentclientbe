import express from "express";
import { methodNotAllowed } from "../../common/utils/common.utils";
import { verifyToken } from "../auth/auth.routes";
import { validateVenueRequest } from "../../validator/institute.validator";
import {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
} from "./venue.routes";
const router = express.Router({});

router
  .route("/")
  .post(verifyToken, validateVenueRequest, createVenue)
  .get(verifyToken, getAllVenues)
  .all(methodNotAllowed);

router
  .route("/:id")
  .get(verifyToken, getVenueById)
  .put(verifyToken, validateVenueRequest, updateVenue)
  .all(methodNotAllowed);

export default router;

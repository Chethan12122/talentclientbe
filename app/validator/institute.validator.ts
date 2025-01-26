/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";

const instituteCreateSchema = z.object({
  name: z.string().min(1),
  venue: z.string().optional(),
});

function validateInstituteRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(JSON.stringify(req.body));
    instituteCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_INSTITUTE_REQUEST
    );
  }
}

function validateVenueRequest(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info(JSON.stringify(req.body));
    z.object({
      name: z.string().min(1),
    }).parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_VENUE_REQUEST
    );
  }
}

export { validateInstituteRequest, validateVenueRequest };

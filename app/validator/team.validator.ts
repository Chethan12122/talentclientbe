/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";

const teamCreateSchema = z.object({
  institute_id: z.string().min(1),
});

function validateTeamRequest(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info(JSON.stringify(req.body));
    teamCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_TEAM_REQUEST
    );
  }
}

export { validateTeamRequest };

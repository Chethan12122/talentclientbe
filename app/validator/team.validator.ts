/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";
import { TEAM_TYPE } from "../common/enum";

const teamCreateSchema = z.object({
  team_name: z.string().min(1),
  institute_name: z.string().min(1),
  team_type: z.enum(Object.values(TEAM_TYPE) as [string, ...string[]]),
  team_venue: z.string().min(1),
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

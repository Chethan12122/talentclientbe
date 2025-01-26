/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";
import { FIXTURE_STATUS, FIXTURE_TYPE } from "../common/enum";

const manualFixtureCreateSchema = z.object({
  category_id: z.string().min(1),
  season_id: z.string().min(1),
  fixture_date: z.string().min(1),
  venue: z.string().min(1),
  status: z.enum(Object.values(FIXTURE_STATUS) as [string, ...string[]]),
  fixture_type: z.enum(Object.values(FIXTURE_TYPE) as [string, ...string[]]),
});

function validateManualFixtureRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(JSON.stringify(req.body));
    manualFixtureCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_MANUAL_FIXTURE_REQUEST
    );
  }
}

export { validateManualFixtureRequest };

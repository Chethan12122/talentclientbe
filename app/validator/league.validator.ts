/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";
import { LEAGUE_STATUS } from "../common/enum";

const leagueCreateSchema = z
  .object({
    name: z.string().min(3, "League name must be at least 3 characters long"),
    district_id: z.string().min(1),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters"),
    status: z
      .enum(Object.values(LEAGUE_STATUS) as [string, ...string[]])
      .default(LEAGUE_STATUS.UPCOMING),
    start_date: z.preprocess((val) => new Date(val as string), z.date()),
    end_date: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    ),
  })
  .refine((data) => !data.end_date || data.start_date <= data.end_date, {
    message: "start_date must be earlier than or equal to end_date",
    path: ["start_date", "end_date"],
  });

function validateLeagueRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Validating league request: " + JSON.stringify(req.body));
    leagueCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error("League validation error: " + error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_LEAGUE_REQUEST
    );
  }
}

export { validateLeagueRequest };

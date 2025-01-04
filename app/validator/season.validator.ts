/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";

const seasonCreateSchema = z
  .object({
    start_date: z.preprocess((val) => new Date(val as string), z.date()),
    end_date: z.preprocess((val) => new Date(val as string), z.date()),
    break_start_date: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    ),
    break_end_date: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    ),
  })
  .refine((data) => data.start_date <= data.end_date, {
    message: "start_date must be earlier than or equal to end_date",
    path: ["start_date", "end_date"],
  })
  .refine(
    (data) =>
      !data.break_start_date ||
      (data.break_start_date > data.start_date &&
        data.break_start_date < data.end_date),
    {
      message:
        "break_start_date must be between start_date and end_date if provided",
      path: ["break_start_date"],
    }
  )
  .refine(
    (data) =>
      !data.break_end_date ||
      (data.break_end_date > data.start_date &&
        data.break_end_date < data.end_date),
    {
      message:
        "break_end_date must be between start_date and end_date if provided",
      path: ["break_end_date"],
    }
  )
  .refine(
    (data) =>
      !data.break_start_date ||
      !data.break_end_date ||
      data.break_start_date <= data.break_end_date,
    {
      message: "break_start_date must be before or equal to break_end_date",
      path: ["break_start_date", "break_end_date"],
    }
  )
  .refine(
    (data) =>
      (!data.break_start_date && !data.break_end_date) ||
      (data.break_start_date && data.break_end_date),
    {
      message:
        "Both break_start_date and break_end_date must be provided if one is specified",
      path: ["break_start_date", "break_end_date"],
    }
  );

function validateSeasonRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(JSON.stringify(req.body));
    seasonCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_SEASON_REQUEST
    );
  }
}

export { validateSeasonRequest };

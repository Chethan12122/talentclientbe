/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";
import { EVENT_TYPE } from "../common/enum";

const eventCreateSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((value) => value.toUpperCase()),
  type: z.enum(Object.values(EVENT_TYPE) as [string, ...string[]]),
});

function validateEventRequest(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info(JSON.stringify(req.body));
    req.body = eventCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_EVENT_REQUEST
    );
  }
}

export { validateEventRequest };

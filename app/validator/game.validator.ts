/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";
import { GAME_CATEGORY_TYPE } from "../common/enum";

const gameCreateSchema = z.object({
  game_name: z
    .string()
    .min(1)
    .transform((value) => value.toUpperCase()),
});

function validateGameRequest(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info(JSON.stringify(req.body));
    req.body = gameCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_GAME_REQUEST
    );
  }
}

const gameCategoryCreateSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((value) => value.toUpperCase()),
  type: z.enum(Object.values(GAME_CATEGORY_TYPE) as [string, ...string[]]),
});

function validateGameCategoryRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(JSON.stringify(req.body));
    req.body = gameCategoryCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_GAME_CATEGORY_REQUEST
    );
  }
}

export { validateGameRequest, validateGameCategoryRequest };

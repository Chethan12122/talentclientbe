/* eslint-disable no-extra-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { NonRetryableException } from "../errors/base.error";
import { ApplicationStaticErrors } from "../errors/application.error";
import { z } from "zod";
import { logger } from "../common/logger";

const scoreCreateSchema = z.object({
  fixture_id: z.string().min(1),
  referee_id: z.string().min(1),
  winning_team_id: z.string().min(1),
  losing_team_id: z.string().min(1),
  // scores_key can be any json
  scores_key: z.any(),
});

function validateScoreRequest(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info(JSON.stringify(req.body));
    scoreCreateSchema.parse(req.body);
    next();
  } catch (error: any) {
    logger.error(error.message);
    throw new NonRetryableException(
      ApplicationStaticErrors.INVALID_SCORE_REQUEST
    );
  }
}

export { validateScoreRequest };

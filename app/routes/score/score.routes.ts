import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";

import scoreService from "../../service/score/score.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await scoreService.create(req.body);
    res.json({
      data: response,
      message: "Score created successfully",
    });
  } catch (error) {
    logger.error("Error inside score create controller");
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await scoreService.updateScoreById(
      req.params.score_id,
      req.body
    );
    res.json({
      data: response,
      message: "Score updated successfully",
    });
  } catch (error) {
    logger.error("Error inside score update controller");
    next(error);
  }
}

export async function getScoreById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await scoreService.getScoreById(req.params.score_id);
    res.json({
      data: response,
      message: "Score fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside score get by id controller");
    next(error);
  }
}

export async function getAllScores(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fixture_id = req.query.fixture_id as string;
    const response = await scoreService.getAllScores(fixture_id);
    res.json({
      data: response,
      message: "Scores fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside score get all controller");
    next(error);
  }
}

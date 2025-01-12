import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import fixtureService from "../../service/fixtures/fixtures.service";

export async function generateFixtures(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await fixtureService.generateFixtures(
      req.body.game_category_id,
      req.body.season_id
    );
    res.json({
      message: "Fixtures generated successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside generate fixtures controller");
    next(error);
  }
}

export async function getFixturesForCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await fixtureService.getFixturesForCategory(
      req.query.game_category_id as string
    );
    res.json({
      message: "Fixtures fetched successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside get fixtures for category controller");
    next(error);
  }
}

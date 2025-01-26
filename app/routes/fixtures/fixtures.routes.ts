import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import fixtureService from "../../service/fixtures/fixtures.service";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationStaticErrors } from "../../errors/application.error";

export async function generateFixturesForGameCategory(
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

export async function generateFixturesForGame(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await fixtureService.generateFixturesForGame(
      req.body.game_id as string,
      req.body.season_id as string
    );

    res.json({
      message: "Fixtures fetched successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside get fixtures for game controller");

    next(error);
  }
}

export async function getFixturesForCategoryAndSeason(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const key = req.query.key as string;
    if (key === "game") {
      if (!req.query.game_id || !req.query.season_id) {
        throw new NonRetryableException(
          ApplicationStaticErrors.INVALID_GAME_REQUEST
        );
      }
      const response = await fixtureService.getFixturesForGame(
        req.query.game_id as string,
        req.query.season_id as string
      );

      res.json({
        message: "Fixtures fetched for game successfully",
        data: response,
      });
    }
    const response = await fixtureService.getFixturesForCategoryAndSeason(
      req.query.game_category_id as string,
      req.query.season_id as string
    );

    res.json({
      message: "Fixtures fetched successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside get fixtures for category controller", error);
    next(error);
  }
}

export async function manualFixtureCreation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await fixtureService.manualFixtureCreation(req.body);
    res.json({
      message: "Fixtures created successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside manual fixture creation controller");
    next(error);
  }
}

export async function updateFixture(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (
      req.query.fixture_id === null ||
      req.query.fixture_id?.length === 0 ||
      req.body.category_id === undefined ||
      req.body.category_id?.length === 0
    ) {
      throw new NonRetryableException(
        ApplicationStaticErrors.INVALID_FIXTURE_REQUEST
      );
    } 
    const response = await fixtureService.updateFixture(
      req.query.fixture_id as string,
      req.body
    );
    res.json({
      message: "Fixture updated successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside update fixture controller");
    next(error);
  }
}

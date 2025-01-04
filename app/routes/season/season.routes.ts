import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import seasonService from "../../service/season/season.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await seasonService.createOrUpdate(req.body);
    res.json({
      message:
        "Season created/updated successfully with season = " +
        response.season_name,
    });
  } catch (error) {
    logger.error("Error inside season create controller");
    next(error);
  }
}

export async function getAllSeasons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await seasonService.getAllSeasons();
    res.json({
      data: response,
      message: "Seasons fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside season get all controller");
    next(error);
  }
}

export async function getSeasonByName(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await seasonService.getSeasonByName(
      req.params.season_name
    );
    res.json({
      data: response,
      message: "Season fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside season get by name controller");
    next(error);
  }
}

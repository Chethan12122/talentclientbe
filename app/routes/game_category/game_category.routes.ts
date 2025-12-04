import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import gameService from "../../service/game/game.service";
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.createGameCategory(req.body);
    res.json({
      message: "Game category created successfully !!",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside game category create controller");
    next(error);
  }
}

export async function getAllGameCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.getAllGameCategories();
    res.json({
      data: response,
      message: "Game categories fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside game category get all controller");
    next(error);
  }
}

export async function getGameCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.getGameCategoryById(
      req.params.category_id
    );
    res.json({
      data: response,
      message: "Game category fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside game category get by id controller");
    next(error);
  }
}

export async function deleteGameCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.deleteGameCategoryById(
      req.params.category_id
    );
    res.json({
      data: response,
      message: "Game category deleted successfully",
    });
  } catch (error) {
    logger.error("Error inside game category delete by id controller");
    next(error);
  }
}

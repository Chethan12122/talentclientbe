import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import gameService from "../../service/game/game.service";
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.createGame(req.body);
    res.json({
      message: "Game created successfully !!",
      game_id: response.game_id,
    });
  } catch (error) {
    logger.error("Error inside game create controller");
    next(error);
  }
}

export async function getAllGames(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.getAllGames();
    res.json({
      data: response,
      message: "Games fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside game get all controller");
    next(error);
  }
}

export async function getGameById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.getGameById(req.params.game_id);
    res.json({
      data: response,
      message: "Game fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside game get by id controller");
    next(error);
  }
}

export async function deleteGameById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await gameService.deleteGameById(req.params.game_id);
    res.json({
      data: response,
      message: "Game deleted successfully",
    });
  } catch (error) {
    logger.error("Error inside game delete by id controller");
    next(error);
  }
}

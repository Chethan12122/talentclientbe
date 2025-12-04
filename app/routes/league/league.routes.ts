import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import leagueService from "../../service/league/league.service";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationStaticErrors } from "../../errors/application.error";

export async function createLeague(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId; // Now TypeScript knows about this property
    if (!userId) {
      throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);
    }
    const response = await leagueService.createLeague(req.body, userId);
    res.json({
      data: response,
      message: "League created successfully",
    });
  } catch (error) {
    logger.error("Error inside league create controller");
    next(error);
  }
}

export async function getAllLeagues(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await leagueService.getAllLeagues();
    res.json({
      data: response,
      message: "Leagues fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside league getAll controller");
    next(error);
  }
}

export async function getLeagueById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const response = await leagueService.getLeagueById(id);
    res.json({
      data: response,
      message: "League fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside league getById controller");
    next(error);
  }
}

export async function updateLeague(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = req.userId; // Changed from req.headers["user_id"]
    if (!userId) {
      throw new NonRetryableException(ApplicationStaticErrors.UNAUTHORIZED);
    }
    const response = await leagueService.updateLeague(id, req.body, userId);
    res.json({
      data: response,
      message: "League updated successfully",
    });
  } catch (error) {
    logger.error("Error inside league update controller");
    next(error);
  }
}

export async function createGroupsAndAssignInstitues(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const response = await leagueService.createGroupsAndAssignInstitutes(id);
    res.json({
      data: response,
      message: "Groups and Institues assigned successfully",
    });
  } catch (error) {
    logger.error("Error inside league update controller");
    next(error);
  }
}

export async function getAllGroupsAndInstitutes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const response = await leagueService.getAllGroupsAndInstitutes(id);
    res.json({
      data: response,
      message: "Groups and Institues fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside league update controller");
    next(error);
  }
}

export async function scheduleLeagueGroupTimes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { lgroupId } = req.params;
    const { scheduledTime } = req.body;
    const response = await leagueService.scheduleLeagueGroupTimes(
      lgroupId,
      scheduledTime
    );
    res.json({
      data: response,
      message: "Groups and Institues fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside league update controller");
    next(error);
  }
}

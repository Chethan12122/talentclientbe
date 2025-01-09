import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import teamService from "../../service/team/team.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await teamService.create(req.body);
    res.json({
      message:
        "Team created/updated successfully with team = " + response.team_name,
        data: response
    });
  } catch (error) {
    logger.error("Error inside team create controller");
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await teamService.update(req.params.team_id, req.body);
    res.json({
      message:
        "Team updated successfully" + req.params.team_id,
    });
  } catch (error) {
    logger.error("Error inside team update controller");
    next(error);
  }
}

export async function getAllTeams(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filter_team_type = req.query.f_team_type;
    const response = await teamService.getAllTeams(filter_team_type as string);
    res.json({
      data: response,
      message: "Teams fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside team get all controller");
    next(error);
  }
}

export async function getTeamById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await teamService.getTeamById(req.params.team_id);
    res.json({
      data: response,
      message: "Team fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside team get by name controller");
    next(error);
  }
}

export async function deleteTeamById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await teamService.deleteTeamById(req.params.team_id);
    res.json({
      data: response,
      message: "Team deleted successfully",
    });
  } catch (error) {
    logger.error("Error inside team delete by id controller");
    next(error);
  }
}

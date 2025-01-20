import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";

import instituteService from "../../service/institute/institute.service";

export async function getAllVenues(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.getAllVenues();
    res.json({
      data: response,
      message: "Venues fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside Venue get controller");
    next(error);
  }
}

export async function getVenueById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.getVenueById(req.params.id);
    res.json({
      data: response,
      message: "Venue fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside Venue get by id controller");
    next(error);
  }
}

export async function createVenue(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.createVenue(req.body);
    res.json({
      data: response,
      message: "Venue created/updated successfully",
    });
  } catch (error) {
    logger.error("Error inside Venue create controller");
    next(error);
  }
}

export async function updateVenue(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.updateVenue(
      req.body,
      req.params.id
    );
    res.json({
      data: response,
      message: "Venue created/updated successfully",
    });
  } catch (error) {
    logger.error("Error inside Venue update controller");
    next(error);
  }
}

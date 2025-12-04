import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import eventService from "../../service/events/events.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await eventService.createEvent(req.body);
    res.json({
      message: "Event created successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside event create controller");
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await eventService.updateEventById(req.params.event_id, req.body);
    res.json({
      message: "Event updated successfully for id :" + req.params.event_id,
    });
  } catch (error) {
    logger.error("Error inside event update controller");
    next(error);
  }
}

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await eventService.getAllEvents();
    res.json({
      data: response,
      message: "Events fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside event get all controller");
    next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await eventService.getEventById(req.params.event_id);
    res.json({
      data: response,
      message: "Event fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside event get by name controller");
    next(error);
  }
}

export async function deleteById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await eventService.deleteEventById(req.params.event_id);
    res.json({
      data: response,
      message: "Event deleted successfully",
    });
  } catch (error) {
    logger.error("Error inside events delete by id controller");
    next(error);
  }
}

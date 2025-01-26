import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";

import instituteService from "../../service/institute/institute.service";

export async function getAllInstitutes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.getAllInstitutes();
    res.json({
      data: response,
      message: "Institutes fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside Institutes get controller");
    next(error);
  }
}

export async function getInstituteById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.getInstituteById(
      req.params.institute_id
    );
    res.json({
      data: response,
      message: "Institute fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside Institutes get by id controller");
    next(error);
  }
}

export async function createInstitute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.createInstitute(req.body);
    res.json({
      data: response,
      message: "Institute created successfully",
    });
  } catch (error) {
    logger.error("Error inside Institutes create controller");
    next(error);
  }
}

export async function updateInstitute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.updateInstitute(
      req.body,
      req.params.institute_id
    );
    res.json({
      data: response,
      message: "Institute updated successfully",
    });
  } catch (error) {
    logger.error("Error inside Institutes update controller");
    next(error);
  }
}

export async function deleteInstituteById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await instituteService.deleteInstituteById(
      req.params.institute_id
    );
    res.json({
      data: response,
      message: "Institute deleted successfully",
    });
  } catch (error) {
    logger.error("Error inside Institutes delete by id controller");
    next(error);
  }
}

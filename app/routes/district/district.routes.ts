import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import districtService from "../../service/districts/districts.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await districtService.createDistrict(req.body);
    res.json({
      message: "District created successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error inside district create controller");
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await districtService.updateDistrictById(req.params.district_id, req.body);
    res.json({
      message:
        "District updated successfully for id :" + req.params.district_id,
    });
  } catch (error) {
    logger.error("Error inside district update controller");
    next(error);
  }
}

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await districtService.getAllDistricts();
    res.json({
      data: response,
      message: "District fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside district get all controller");
    next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await districtService.getDistrictById(
      req.params.district_id
    );
    res.json({
      data: response,
      message: "District fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside district get by name controller");
    next(error);
  }
}

export async function deleteById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await districtService.deleteDistrictById(
      req.params.district_id
    );
    res.json({
      data: response,
      message: "District deleted successfully",
    });
  } catch (error) {
    logger.error("Error inside districts delete by id controller");
    next(error);
  }
}

import { logger } from "../../common/logger";
import { Request, Response, NextFunction } from "express";
import userService from "../../service/user/user.service";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await userService.getAllUsers();
    res.json({
      data: response,
      message: "Users fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside users get all controller");
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const response = await userService.getUserById(req.params.user_id);
    res.json({
      data: response,
      message: "User fetched successfully",
    });
  } catch (error) {
    logger.error("Error inside users get by id controller");
    next(error);
  }
}

// export async function updateUser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     // await userService.updateUser(req.params.user_id, req.body);
//     res.json({
//       message: "User updated successfully",
//     });
//   } catch (error) {
//     logger.error("Error inside users update controller");
//     next(error);
//   }
// }

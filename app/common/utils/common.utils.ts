import { HTTP_STATUS } from "../constants";
import { Request, Response } from "express";
import QRCode from "qrcode";
import { supabase } from "../supabase";
import { NonRetryableException } from "../../errors/base.error";
import { ApplicationStaticErrors } from "../../errors/application.error";
import { logger } from "../logger";
import { config } from "../config";

function methodNotAllowed(req: Request, res: Response): void {
  res.status(405).send(HTTP_STATUS.METHOD_NOT_FOUND);
}

async function generateScannerCodeUrl(userId: string): Promise<string> {
  try {
    const fileName = `scanner_${userId}.png`;

    const qrBuffer = await QRCode.toBuffer(`${config.appCodeUrl}/${userId}`, { type: "png", width: 300 });

    const { error } = await supabase.storage
      .from("scanner-codes")
      .upload(fileName, qrBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      logger.error("ERRRRROR", error);
      throw new NonRetryableException(
        ApplicationStaticErrors.SOMETHING_WENT_WRONG
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("scanner-codes").getPublicUrl(fileName);
    return publicUrl;
  } catch (err) {
    logger.error(err);
    throw new NonRetryableException(
      ApplicationStaticErrors.SOMETHING_WENT_WRONG
    );
  }
}

export { methodNotAllowed, generateScannerCodeUrl };

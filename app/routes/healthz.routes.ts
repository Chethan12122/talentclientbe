import { Router, Request, Response } from "express";

const healthzRouter = Router();

healthzRouter.get("/_healthz", (req: Request, res: Response) => {
  res.json({
    ok: "ok",
  });
});

export default healthzRouter;

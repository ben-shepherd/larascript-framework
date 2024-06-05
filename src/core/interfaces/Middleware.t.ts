import { NextFunction, Request, Response } from "express";

export type Middleware = (req: Request, res: Response, nex: NextFunction) => Promise<void> | void
import { Request, Response } from "express";

export type IRouteAction = (req: Request, res: Response) => any;
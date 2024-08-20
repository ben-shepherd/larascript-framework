import { Response } from "express";
import { BaseRequest } from "../types/BaseRequest.t";

export type IAction = (req: BaseRequest, res: Response, ...args: any[]) => Promise<any>;
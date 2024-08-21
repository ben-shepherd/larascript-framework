import { Response } from "express";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

export type IAction = (req: BaseRequest, res: Response, ...args: any[]) => Promise<any>;
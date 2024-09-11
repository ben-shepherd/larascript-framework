/* eslint-disable no-unused-vars */
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from "express";

export type IAction = (req: BaseRequest, res: Response, ...args: any[]) => Promise<any>;
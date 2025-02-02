/* eslint-disable no-unused-vars */
import { BaseRequest } from "@src/core/domains/http/interfaces/BaseRequest.t";
import { Response } from "express";

export type IAction = (req: BaseRequest, res: Response, ...args: any[]) => Promise<any>;
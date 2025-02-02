/* eslint-disable no-unused-vars */
import { BaseRequest } from "@src/core/domains/http/interfaces/BaseRequest.t";
import { Response } from "express";

export type IRouteAction = (req: BaseRequest, res: Response) => any;

export type IRouteResourceAction = (options: IRouteResourceAction, action: IRouteAction) => any;
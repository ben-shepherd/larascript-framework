/* eslint-disable no-unused-vars */
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from "express";

import { IRouteResourceOptionsLegacy } from "./IRouteResourceOptionsLegacy";

export type IPartialRouteResourceOptions = Omit<IRouteResourceOptionsLegacy, 'path' | 'except' | 'only'>

export interface IResourceService {
    handler(req: BaseRequest, res: Response, options: IPartialRouteResourceOptions): Promise<void>
}

export interface IPageOptions {
    page: number;
    pageSize?: number;
    skip?: number;
}
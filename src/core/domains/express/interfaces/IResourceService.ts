/* eslint-disable no-unused-vars */
import { Response } from "express";

import { BaseRequest } from "../types/BaseRequest.t";
import { IRouteResourceOptions } from "./IRouteResourceOptions";

export type IPartialRouteResourceOptions = Omit<IRouteResourceOptions, 'path' | 'except' | 'only'>

export interface IResourceService {
    handler(req: BaseRequest, res: Response, options: IPartialRouteResourceOptions): Promise<void>
}

export interface IPageOptions {
    page: number;
    pageSize?: number;
    skip?: number;
}
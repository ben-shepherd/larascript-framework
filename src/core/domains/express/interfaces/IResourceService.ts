/* eslint-disable no-unused-vars */
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { Response } from "express";

export type IPartialRouteResourceOptions = Omit<IRouteResourceOptions, 'path' | 'except' | 'only'>

export interface IResourceService {
    handler(req: BaseRequest, res: Response, options: IPartialRouteResourceOptions): Promise<void>
}

export interface IPageOptions {
    page: number;
    pageSize?: number;
    skip?: number;
}
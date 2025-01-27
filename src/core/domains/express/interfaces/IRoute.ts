/* eslint-disable no-unused-vars */
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

import { ControllerConstructor } from "./IController";
import { TExpressMiddlewareFnOrClass } from "./IMiddleware";
import { SearchOptionsLegacy } from "./IRouteResourceOptionsLegacy";
import { ISecurityRule } from "./ISecurity";

export type RouteConstructor = {
    new (...args: any[]): IRouter;
    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;
}

export interface IRouteGroupOptions {
    prefix?: string;
    name?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
    security?: ISecurityRule[]
}

export type TRouteGroupFn = (routes: IRouter) => void;

export type TPartialRouteItemOptions = Omit<TRouteItem, 'path' | 'method' | 'action'>;

export interface IRouter {

    options: IRouteGroupOptions | null;

    getRegisteredRoutes(): TRouteItem[];

    setRegisteredRoutes(routes: TRouteItem[]): void;

    get(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    post(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    put(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    patch(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    delete(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;

    resource(options: TRouteResourceOptions): IRouter;
}

export interface IRoute {
    group(routesFn?: TRouteGroupFn): IRouter;
    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;
}

export type TResourceType = 'index' | 'show' | 'create' | 'update' | 'delete';

export type TRouteItem = {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    action: string | TExpressMiddlewareFnOrClass;
    name?: string;
    prefix?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
    security?: ISecurityRule[];
    resourceConstructor?: ModelConstructor<IModel>;
    resourceType?: TResourceType;
    showFilters?: object;
    allFilters?: object;
    paginate?: {
        pageSize: number;
        allowPageSizeOverride?: boolean;
    },
    searching?: SearchOptionsLegacy
}

export type TRouteResourceOptions = {
    prefix: string;
    resource: ModelConstructor<IModel>;
    security?: ISecurityRule[];
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
}
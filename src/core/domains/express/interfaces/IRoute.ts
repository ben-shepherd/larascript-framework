/* eslint-disable no-unused-vars */
import { ValidatorCtor } from "../../validator/types/ValidatorCtor";
import { ControllerConstructor } from "./IController";
import { TExpressMiddlewareFnOrClass } from "./IMiddleware";
import { IIdentifiableSecurityCallback } from "./ISecurity";

export type RouteConstructor = {
    new (...args: any[]): IRouter;
    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;
}

export interface IRouteGroupOptions {
    prefix?: string;
    name?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
}

export type TRouteGroupFn = (routes: IRouter) => void;

export type TPartialRouteItemOptions = Omit<TRouteItem, 'path' | 'method' | 'action'>;

export interface IRouter {

    options: IRouteGroupOptions | null;

    getRegisteredRoutes(): TRouteItem[];

    get(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    post(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    put(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    patch(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    delete(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;
}

export interface IRoute {
    group(routesFn?: TRouteGroupFn): IRouter;
    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;
}

export type TRouteItem = {
    name?: string;
    prefix?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    action: string | TExpressMiddlewareFnOrClass;
    validator?: ValidatorCtor;
    validateBeforeAction?: boolean;
    security?: IIdentifiableSecurityCallback[];
    scopes?: string[];
    scopesPartial?: string[];
    enableScopes?: boolean;
    resourceType?: 'all' | 'show' | 'create' | 'update' | 'destroy';
}

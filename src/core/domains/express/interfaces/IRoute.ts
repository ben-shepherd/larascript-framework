/* eslint-disable no-unused-vars */
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

import { ControllerConstructor } from "./IController";
import { TExpressMiddlewareFnOrClass } from "./IMiddleware";
import { ISecurityRuleConstructor } from "./ISecurity";

export type RouteConstructor = {
    new (...args: any[]): IRouter;
    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;
}

export interface IRouteGroupOptions {
    prefix?: string;
    name?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
    security?: ISecurityRuleConstructor | ISecurityRuleConstructor[]
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

export type TResourceType = 'index' | 'show' | 'create' | 'update' | 'delete';

export type TRouteItem = {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    action: string | TExpressMiddlewareFnOrClass;
    name?: string;
    prefix?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
    security?: ISecurityRuleConstructor | ISecurityRuleConstructor[];
    resource?: ModelConstructor<IModel>;
    resourceType?: TResourceType;
}

export type TRouteResourceOptions = {
    prefix: string;
    resource: ModelConstructor<IModel>;
    security?: ISecurityRuleConstructor | ISecurityRuleConstructor[];
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
}
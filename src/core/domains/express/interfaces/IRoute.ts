/* eslint-disable no-unused-vars */
import { ControllerConstructor } from "@src/core/domains/express/interfaces/IController";
import { TExpressMiddlewareFnOrClass } from "@src/core/domains/express/interfaces/IMiddleware";
import { ISecurityRule } from "@src/core/domains/express/interfaces/ISecurity";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

import { TSortDirection } from "../services/Resources/SortOptions";
import SecurityRules from "../services/SecurityRules";

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

    baseOptions: IRouteGroupOptions | null;

    getRegisteredRoutes(): TRouteItem[];

    setRegisteredRoutes(routes: TRouteItem[]): void;

    get(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    post(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    put(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    patch(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    delete(path: TRouteItem['path'], action: TRouteItem['action'], options?: TPartialRouteItemOptions): void;

    group(options: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter;

    resource(options: TRouteResourceOptions): IRouter;

    security(): typeof SecurityRules;
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
    scopes?: string[];
    resource?: {
        type: TResourceType
        modelConstructor: ModelConstructor<IModel>;
        filters?: {
            show?: object;
            index?: object;
        },
        scopes?: string[];
        searching?: {
            fields?: string[];
        },
        paginate?: {
            pageSize?: number;
            allowPageSizeOverride?: boolean;
        },
        sorting?: {
            fieldKey: string;
            directionKey: string;
            defaultField?: string;
            defaultDirection?: TSortDirection;
        }
    }
}


export type TRouteResourceOptions = {
    prefix: string;
    resource: ModelConstructor<IModel>;
    security?: ISecurityRule[];
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    scopes?: string[];
    filters?: object;
    searching?: {
        fields?: string[];
    }
    paginate?: {
        pageSize: number;
        allowPageSizeOverride?: boolean;
    }
    sorting?: {
        fieldKey: string;
        directionKey: string;
        defaultField?: string;
        defaultDirection?: TSortDirection;
    }
}



export interface IPageOptions {
    page: number;
    pageSize?: number;
    skip?: number;
}
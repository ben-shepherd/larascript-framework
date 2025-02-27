/* eslint-disable no-unused-vars */
import { ControllerConstructor } from "@src/core/domains/http/interfaces/IController";
import { TExpressMiddlewareFnOrClass } from "@src/core/domains/http/interfaces/IMiddleware";
import { ISecurityRule } from "@src/core/domains/http/interfaces/ISecurity";
import SecurityRules from "@src/core/domains/http/security/services/SecurityRules";
import { TSortDirection } from "@src/core/domains/http/utils/SortOptions";
import { CustomValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

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
    config?: Record<string, unknown>;
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

export type TRouterMethodOptions = Omit<TRouteItem, 'path' | 'method' | 'action' | 'resource'>;

export type TRouteItem = {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    action: string | TExpressMiddlewareFnOrClass | ControllerConstructor | [ControllerConstructor, string];
    name?: string;
    prefix?: string;
    middlewares?: TExpressMiddlewareFnOrClass | TExpressMiddlewareFnOrClass[];
    controller?: ControllerConstructor;
    security?: ISecurityRule[];
    config?: Record<string, unknown>;
    validator?: CustomValidatorConstructor | CustomValidatorConstructor[];
    resource?: {
        type: TResourceType
        modelConstructor: ModelConstructor<IModel>;

        filters?: object;
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
        },
        validation?: {
            create?: CustomValidatorConstructor;
            update?: CustomValidatorConstructor;
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
    validator?: CustomValidatorConstructor;
    validateBeforeAction?: boolean;
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
    },
    validation?: {
        create?: CustomValidatorConstructor;
        update?: CustomValidatorConstructor;
    },
    only?: TResourceType[]
}



export interface IPageOptions {
    page: number;
    pageSize?: number;
    skip?: number;
}
import { MiddlewareConstructor, TExpressMiddlewareFn } from '@src/core/domains/express/interfaces/IMiddleware';
import { IRouteAction } from '@src/core/domains/express/interfaces/IRouteAction';
import { IIdentifiableSecurityCallback } from '@src/core/domains/express/interfaces/ISecurity';
import { ValidatorCtor } from '@src/core/domains/validator/types/ValidatorCtor';

export interface IRouteLegacy {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    action: IRouteAction;
    resourceType?: string;
    scopes?: string[];
    scopesPartial?: string[];
    enableScopes?: boolean;
    middlewares?: TExpressMiddlewareFn[] | MiddlewareConstructor[];
    validator?: ValidatorCtor;
    validateBeforeAction?: boolean;
    security?: IIdentifiableSecurityCallback[];
}
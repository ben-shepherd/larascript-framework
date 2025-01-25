import { IRouteAction } from '@src/core/domains/express/interfaces/IRouteAction';
import { IIdentifiableSecurityCallback } from '@src/core/domains/express/interfaces/ISecurity';
import { ValidatorCtor } from '@src/core/domains/validator/types/ValidatorCtor';
import { TExpressMiddlewareFn } from '@src/core/domains/express/interfaces/IMiddleware';

export interface IRoute {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    action: IRouteAction;
    resourceType?: string;
    scopes?: string[];
    scopesPartial?: string[];
    enableScopes?: boolean;
    middlewares?: TExpressMiddlewareFn[];
    validator?: ValidatorCtor;
    validateBeforeAction?: boolean;
    security?: IIdentifiableSecurityCallback[];
}
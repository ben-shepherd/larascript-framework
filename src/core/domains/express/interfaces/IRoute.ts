import { IRouteAction } from '@src/core/domains/express/interfaces/IRouteAction';
import { IIdentifiableSecurityCallback } from '@src/core/domains/express/interfaces/ISecurity';
import { ValidatorCtor } from '@src/core/domains/validator/types/ValidatorCtor';
import { Middleware } from '@src/core/interfaces/Middleware.t';

export interface IRoute {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    action: IRouteAction;
    resourceType?: string;
    scopes?: string[];
    scopesPartial?: string[];
    enableScopes?: boolean;
    middlewares?: Middleware[];
    validator?: ValidatorCtor;
    validateBeforeAction?: boolean;
    security?: IIdentifiableSecurityCallback[];
}
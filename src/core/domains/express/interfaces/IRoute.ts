import { IRouteAction } from '@src/core/domains/express/interfaces/IRouteAction';
import { ValidatorCtor } from '@src/core/domains/validator/types/ValidatorCtor';
import { Middleware } from '@src/core/interfaces/Middleware.t';

export interface IRoute {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    action: IRouteAction;
    middlewares?: Middleware[];
    validator?: ValidatorCtor;
    validateBeforeAction?: boolean;
}
import { ValidatorCtor } from '@src/core/domains/validator/types/ValidatorCtor';
import { Middleware } from '../Middleware.t';
import { IRouteAction } from './IRouteAction';

export interface IRoute {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    action: IRouteAction;
    middlewares?: Middleware[];
    validator?: ValidatorCtor;
}
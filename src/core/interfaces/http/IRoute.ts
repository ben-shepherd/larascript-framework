import { Middleware } from '../Middleware.t';
import { IRouteAction } from './IRouteAction';

export interface IRoute {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    action: IRouteAction;
    middlewares?: Middleware[]
}
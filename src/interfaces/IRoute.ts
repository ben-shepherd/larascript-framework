import { Middleware } from './Middleware.t';
import { RouteHandler } from './RouteHandler.t';

export interface IRoute {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: RouteHandler;
    middlewares?: Middleware[]
}
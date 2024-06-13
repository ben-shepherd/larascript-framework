import { Middleware } from './Middleware.t';
import { RouteHandler } from './RouteHandler.t';

export interface Route {
    name: string;
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    action: RouteHandler;
    middlewares?: Middleware[]
}
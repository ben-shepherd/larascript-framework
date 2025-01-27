import { IRoute, IRouteGroupOptions, IRouter, TRouteGroupFn, TRouteResourceOptions } from "../interfaces/IRoute";
import Router from "./Router";
import ResourceRouter from "./RouteResource";

class Route implements IRoute {

    /**
     * Create a new group of routes.
     */
    public static group(routeGroupOptions: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn, router: IRouter = new Router()): IRouter {
        return router.group(routeGroupOptions, routesFn);
    }

    /**
     * Create a new group of routes.
     */
    public group(optionsOrFn?: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn, router: IRouter = new Router()): IRouter {
        return router.group(optionsOrFn as any, routesFn);
    }

    /**
     * Add resource routes to the router.
     */
    public static resource(options: TRouteResourceOptions, router: Router = new Router()): IRouter {
        return ResourceRouter.resource(options, router);
    }

    /**
     * Add resource routes to the router.
     */
    public resource(options: TRouteResourceOptions, router: Router = new Router()): IRouter {
        return ResourceRouter.resource(options, router);
    }

}

export default Route;
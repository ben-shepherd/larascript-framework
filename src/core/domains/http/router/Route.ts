import { IRoute, IRouteGroupOptions, IRouter, TRouteGroupFn, TRouteResourceOptions } from "@src/core/domains/http/interfaces/IRouter";
import Router from "@src/core/domains/http/router/Router";
import ResourceRouter from "@src/core/domains/http/router/RouterResource";

/**
 * Route class provides static and instance methods for creating route groups and resource routes.
 * 
 * It serves as a facade for the Router and ResourceRouter classes, offering a simplified API for:
 * 
 * - Creating route groups with shared middleware/options via group() method
 * - Creating RESTful resource routes via resource() method
 * 
 * Example usage:
 * ```ts
 * // Create a route group
 * Route.group({ prefix: '/api' }, (router) => {
 *   router.get('/users', UserController)
 * })
 * 
 * // Create resource routes
 * Route.resource({
 *   path: '/users',
 *   controller: UserController
 * })
 * ```
 */
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
import { IRoute, IRouteGroupOptions, IRouter, TRouteGroupFn } from "../interfaces/IRoute";
import Router from "./Router";

class Route implements IRoute {

    /**
     * Create a new group of routes.
     */
    public static group(routeGroupOptions: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter {
        return new Router().group(routeGroupOptions, routesFn);
    }

    /**
     * Create a new group of routes.
     */
    public group(optionsOrFn?: IRouteGroupOptions | TRouteGroupFn, routesFn?: TRouteGroupFn): IRouter {
        return new Router().group(optionsOrFn as any, routesFn);
    }

}

export default Route;
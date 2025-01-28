import expressClient from 'express';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import Middleware from '@src/core/domains/express/base/Middleware';
import HttpContext from '@src/core/domains/express/data/HttpContext';
import RouteException from '@src/core/domains/express/exceptions/RouteException';
import { MiddlewareConstructor, TExpressMiddlewareFn, TExpressMiddlewareFnOrClass } from '@src/core/domains/express/interfaces/IMiddleware';
import { IRouter, TRouteItem } from "@src/core/domains/express/interfaces/IRoute";
import MiddlewareUtil from '@src/core/domains/express/utils/middlewareUtil';

// eslint-disable-next-line no-unused-vars
type ExecuteFn = (context: HttpContext) => Promise<void>;

type IRouteServiceOptions = {
    additionalMiddlewares?: TExpressMiddlewareFnOrClass[]
}

class RouterBindService {
     
    constructor(
        // eslint-disable-next-line no-unused-vars
        private app: expressClient.Express,
        // eslint-disable-next-line no-unused-vars
        private options: IRouteServiceOptions = {}
    ) {
    }

    /**
     * Sets the additional middlewares to be used for all routes.
     * 
     * @param middlewares The middlewares to set
     */
    public setAdditionalMiddlewares(middlewares: TExpressMiddlewareFnOrClass[]): void {
        this.options.additionalMiddlewares = middlewares
    }

    /**
     * Binds all routes from the given router.
     * 
     * @param router The router containing the routes to bind
     */
    public bindRoutes(router: IRouter): void {
        router.getRegisteredRoutes().forEach(routeItem => {
            this.bindRoute(routeItem)
        })
    }

    /**
     * Binds a single route.
     * 
     * @param routeItem The route item to bind
     */
    private bindRoute(routeItem: TRouteItem): void {

        // Middlewares from route item
        const routeItemMiddlewares = (routeItem.middlewares ?? []) as TExpressMiddlewareFnOrClass[]
        const additionalMiddlewares = this.options.additionalMiddlewares ?? [] as TExpressMiddlewareFnOrClass[]

        // Get middlewares
        const middlewares: TExpressMiddlewareFn[] = [
            ...MiddlewareUtil.convertToExpressMiddlewares(routeItemMiddlewares, routeItem),
            ...MiddlewareUtil.convertToExpressMiddlewares(additionalMiddlewares, routeItem)
        ]

        // Get action
        const action = this.getAction(routeItem)

        // Combine middlewares and action
        const handlers: TExpressMiddlewareFn[] = [...middlewares, action]

        // Use the handlers for the given method and path
        this.useHandlers(routeItem.method, routeItem.path, handlers);
    }

    /**
     * Uses the handlers for the given method and path.
     * 
     * @param method The HTTP method to use
     * @param path The path to use
     * @param handlers The handlers to use
     */
    protected useHandlers(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, handlers: TExpressMiddlewareFn[]): void {
        const methodType = method.toLowerCase() as keyof typeof this.app
        const str = `[Express] binding route ${method.toUpperCase()}: '${path}'`;
        logger().info(str)
        this.app[methodType](path, handlers);
    }

    /**
     * Gets the action from the route item.
     * 
     * @param routeItem The route item containing the action
     * @returns The action as an Express middleware function
     */
    protected getAction(routeItem: TRouteItem): TExpressMiddlewareFn {
        if(typeof routeItem.action === 'string') {
            return this.getActionFromController(routeItem)
        }

        const executeFn: ExecuteFn = async (context: HttpContext) => {
            await (routeItem.action as TExpressMiddlewareFn)(context.getRequest(), context.getResponse(), context.getNext())
        }

        return this.createExpressMiddlewareFn(executeFn, routeItem)
    }

    /**
     * Gets the action from the controller.
     * 
     * @param routeItem The route item containing the action
     * @returns The action as an Express middleware function
     */
    protected getActionFromController(routeItem: TRouteItem): TExpressMiddlewareFn {
        if(!routeItem.controller) {
            throw new RouteException(`A controller is required with a route action ('${routeItem.action}')`)
        }

        const controllerConstructor = routeItem.controller  
        const action = routeItem.action as string

        const executeFn: ExecuteFn = async (context: HttpContext) => {
            const controller = new controllerConstructor(context)
            await controller[action]()
        }

        return this.createExpressMiddlewareFn(executeFn, routeItem)
    }

    /**
     * Converts an array of middleware classes and middleware functions into an array of Express middleware functions.
     * 
     * @param routeItem The route item containing the middlewares
     * @returns An array of Express middleware functions
     */
    protected getMiddlewaresFromRouteItem(routeItem: TRouteItem): TExpressMiddlewareFn[] {

        // A mix of middleware classes and middleware functions
        const middlewaresArray = (
            Array.isArray(routeItem.middlewares ?? []) 
                ? routeItem.middlewares 
                : [routeItem.middlewares]
        ) as TExpressMiddlewareFnOrClass[]

        // Convert middleware classes to middleware functions
        return middlewaresArray.map(middlware => {
            if(middlware.prototype instanceof Middleware) {
                return (middlware as MiddlewareConstructor).toExpressMiddleware({ routeItem })
            }

            return middlware as TExpressMiddlewareFn
        })
    }

    /**
     * Creates an Express middleware function that wraps the given executeFn
     * and passes the HttpContext to it.
     * 
     * @param executeFn The function to execute when the middleware is called
     * @returns An Express middleware function
     */
    protected createExpressMiddlewareFn(executeFn: ExecuteFn, routeItem: TRouteItem): TExpressMiddlewareFn {
        return async (req: expressClient.Request, res: expressClient.Response, next: expressClient.NextFunction | undefined) => {
            await executeFn(new HttpContext(req, res, next, routeItem))
        }
    }

}

export default RouterBindService;
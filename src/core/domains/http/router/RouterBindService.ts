import RouteException from '@src/core/domains/express/exceptions/RouteException';
import Controller from '@src/core/domains/http/base/Controller';
import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { TBaseRequest } from '@src/core/domains/http/interfaces/BaseRequest';
import { ControllerConstructor } from '@src/core/domains/http/interfaces/IController';
import IExpressConfig from '@src/core/domains/http/interfaces/IHttpConfig';
import { MiddlewareConstructor, TExpressMiddlewareFn, TExpressMiddlewareFnOrClass } from '@src/core/domains/http/interfaces/IMiddleware';
import { IRouter, TRouteItem } from "@src/core/domains/http/interfaces/IRouter";
import MiddlewareUtil from '@src/core/domains/http/utils/middlewareUtil';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import { default as express, default as expressClient } from 'express';

// eslint-disable-next-line no-unused-vars
type ExecuteFn = (context: HttpContext) => Promise<void>;

type IRouteServiceOptions = {
    additionalMiddlewares?: (express.RequestHandler | TExpressMiddlewareFnOrClass)[]
}

/**
 * RouterBindService handles binding routes from a Router instance to an Express application
 * 
 * This service is responsible for:
 * - Taking routes registered in a Router and binding them to Express routes
 * - Converting Router middleware/controllers to Express middleware functions
 * - Applying additional global middleware to all routes
 * - Setting up the Express app configuration
 * - Logging route binding details
 * 
 * Example usage:
 * ```ts
 * const bindService = new RouterBindService();
 * bindService.setExpress(expressApp, config);
 * bindService.setAdditionalMiddlewares([authMiddleware]);
 * bindService.bindRoutes(router);
 * ```
 */

class RouterBindService {

    private app!: expressClient.Express;

    private options: IRouteServiceOptions = {}

    private config!: IExpressConfig | null

    /**
     * Sets the Express instance to be used.

     * 

     * @param app The Express instance to set
     */
    public setExpress(app: expressClient.Express, config: IExpressConfig | null): void {
        this.app = app
        this.config = config
    }


    /**
     * Sets the options to be used.
     * 
     * @param options The options to set
     */
    public setOptions(options: IRouteServiceOptions): void {
        this.options = options
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
            this.logBoundRouteDetails(routeItem)
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
        const actionHandler = this.getActionHandler(routeItem)

        // Combine middlewares and action
        const handlers: TExpressMiddlewareFn[] = [...middlewares, actionHandler]

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
    protected getActionHandler(routeItem: TRouteItem): TExpressMiddlewareFn {

        // Only provided a string action (method name)
        if(typeof routeItem.action === 'string') {
            return this.getActionFromController(routeItem)
        }

        // Provided an array of [controller, action]
        if(Array.isArray(routeItem.action)) {
            if(routeItem.action.length !== 2) { 
                throw new RouteException(`Invalid action provided for route '${routeItem.path}'. Expected an array of [controller, action]`)
            }
            return this.getActionFromController({ ...routeItem, controller: routeItem.action?.[0], action: routeItem.action?.[1] ?? 'invoke' })
        }

        // Only provided a controller constructor, use the invoke method
        if(routeItem.action.prototype instanceof Controller) {
            return this.getActionFromController({ ...routeItem, action: 'invoke', controller: routeItem.action as ControllerConstructor })
        }

        // Normal Express middleware function
        const executeFn: ExecuteFn = async (context: HttpContext) => {
            await (routeItem.action as TExpressMiddlewareFn)(context.getRequest(), context.getResponse(), context.getNext())
        }

        // Create the middleware function
        return this.wrapWithHttpContext(executeFn, routeItem)
    }

    /**
     * Gets the action from the controller.
     * 
     * @param routeItem The route item containing the action
     * @returns The action as an Express middleware function
     */
    protected getActionFromController(routeItem: TRouteItem): TExpressMiddlewareFn {
        if(!routeItem.controller) {
            throw new RouteException(`Invalid route ('${routeItem.path}'). A controller is required with a route action '${routeItem.action}'.`)
        }

        const controllerConstructor = routeItem.controller  
        const action = routeItem.action as string

        return this.wrapWithHttpContext(async (context: HttpContext) => {
            await controllerConstructor.executeAction(action, context)
        }, routeItem)
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
     * with HttpContext handling.
     * 
     * @param executeFn The function to execute with HttpContext
     * @returns An Express middleware function
     */
    protected wrapWithHttpContext(executeFn: ExecuteFn, routeItem: TRouteItem): TExpressMiddlewareFn {
        return async (req: expressClient.Request, res: expressClient.Response, next: expressClient.NextFunction | undefined) => {
            await executeFn(new HttpContext(req as TBaseRequest, res, next, routeItem))
        }
    }

    /**
     * Logs the route details.
     * 
     * @param route The route to log
     */
    protected logBoundRouteDetails(route: TRouteItem): void {
        if(!this.config?.logging?.boundRouteDetails) {
            return
        }

        console.log({
            path: route.path,
            method: route.method,
            security: route?.security,
            resource: route?.resource,
            middlewares: route?.middlewares,
            validator: route?.validator,
            config: route?.config
        })
    }

}

export default RouterBindService;
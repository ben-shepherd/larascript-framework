import Service from '@src/core/base/Service';
import Middleware from '@src/core/domains/http/base/Middleware';
import { default as IExpressConfig, default as IHttpConfig } from '@src/core/domains/http/interfaces/IHttpConfig';
import IHttpService from '@src/core/domains/http/interfaces/IHttpService';
import { MiddlewareConstructor, TExpressMiddlewareFn } from '@src/core/domains/http/interfaces/IMiddleware';
import { IRoute, IRouter, TRouteItem } from '@src/core/domains/http/interfaces/IRouter';
import BasicLoggerMiddleware from '@src/core/domains/http/middleware/BasicLoggerMiddleware';
import EndRequestContextMiddleware from '@src/core/domains/http/middleware/EndRequestContextMiddleware';
import RequestIdMiddleware from '@src/core/domains/http/middleware/RequestIdMiddleware';
import SecurityMiddleware from '@src/core/domains/http/middleware/SecurityMiddleware';
import Route from '@src/core/domains/http/router/Route';
import RouterBindService from '@src/core/domains/http/router/RouterBindService';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import ValidateMiddleware from '@src/core/domains/validator/middleware/ValidateMiddleware';
import { app } from '@src/core/services/App';
import expressClient from 'express';


/**
 * Short hand for `app('http')`

 */
export const http = () => app('http');


/**
 * ExpressService class
 * Responsible for initializing and configuring ExpressJS
 * @implements IHttpService
 */
export default class HttpService extends Service<IHttpConfig> implements IHttpService {


    protected config!: IExpressConfig | null;

    private readonly app: expressClient.Express

    private routerBindService!: RouterBindService;

    protected registeredRoutes: TRouteItem[] = []

    /**
     * Config defined in @src/config/http/express.ts
     * @param config 
     */
    constructor(config: IExpressConfig | null = null) {
        super(config)
        this.routerBindService = new RouterBindService()
        this.app = expressClient()
    }

    /**
     * Returns the route instance.
     */
    public route(): IRoute {
        return new Route();
    }

    /**
     * Returns the registered routes.
     */
    public getRegisteredRoutes(): TRouteItem[] {
        return this.registeredRoutes
    }

    /**
     * Initializes ExpressService by applying global middleware defined in config.
     * Global middleware is applied in the order it is defined in the config.
     * 
     * Global Middleware Note:
     *   When middlewares are added globally via app.use(), they don't have access
     *   to this route context. By adding them here through the RouterBindService,
     *   each middleware receives the routeItem as part of its context.
     */
    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }

        // Adds an identifier to the request object
        // This id is used in the requestContext service to store information over a request life cycle
        // this.app.use(requestIdMiddleware())
        this.app.use(RequestIdMiddleware.toExpressMiddleware())

        // End the request context
        // This will be called when the request is finished
        // Deletes the request context and associated values
        this.app.use(EndRequestContextMiddleware.toExpressMiddleware())

        // Log requests
        if(this.config?.logging?.requests) {
            this.app.use(BasicLoggerMiddleware.toExpressMiddleware())
        }

        // Apply global middlewares
        for (const middleware of this.config?.globalMiddlewares ?? []) {
            this.app.use(middleware);
        }

    }

    /**
     * Adds a middleware to the Express instance.
     * @param middleware - The middleware to add
     */
    public useMiddleware(middleware: TExpressMiddlewareFn | MiddlewareConstructor) {
        
        if(middleware.prototype instanceof Middleware) {
            this.app.use((middleware as MiddlewareConstructor).toExpressMiddleware())
        }
        else {
            this.app.use(middleware as TExpressMiddlewareFn)
        }

        logger().info('[ExpressService] middleware: ' + middleware.name)
    }

    /**
     * Starts listening for connections on the port specified in the config.
     * If no port is specified, the service will not start listening.
     */
    public async listen(): Promise<void> {
        const port = this.config?.port

        return new Promise(resolve => {
            this.app.listen(port, () => resolve())
        })
    }

    /**
     * Binds the routes to the Express instance.
     * @param router - The router to bind
     */
    public bindRoutes(router: IRouter): void {
        if(router.getRegisteredRoutes().length === 0) {
            return

        }

        // These middlewares are added here instead of as global middlewares because
        // they need access to the routeItem from the router. The routeItem contains
        // important metadata like:
        // - security requirements (used by SecurityMiddleware)
        // - validator configuration (used by ValidateMiddleware)
        // - other route-specific settings
        const additionalMiddlewares = [
            SecurityMiddleware,
            ValidateMiddleware
        ]

        this.routerBindService.setExpress(this.app, this.config)
        this.routerBindService.setOptions({ additionalMiddlewares })
        this.routerBindService.bindRoutes(router)
        this.registeredRoutes.push(...router.getRegisteredRoutes())
    }

    /**
     * Returns the Express instance.
     */
    public getExpress(): expressClient.Express {
        return this.app
    }

    /**
     * Checks if Express is enabled.
     * @returns true if enabled, false otherwise.
     */
    public isEnabled(): boolean {
        return this.config?.enabled ?? false
    }

}

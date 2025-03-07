import Service from '@src/core/base/Service';
import Middleware from '@src/core/domains/http/base/Middleware';
import { default as IExpressConfig, default as IHttpConfig } from '@src/core/domains/http/interfaces/IHttpConfig';
import IHttpService from '@src/core/domains/http/interfaces/IHttpService';
import { MiddlewareConstructor, TExpressMiddlewareFn } from '@src/core/domains/http/interfaces/IMiddleware';
import { IRoute, IRouter, TRouteItem } from '@src/core/domains/http/interfaces/IRouter';
import Route from '@src/core/domains/http/router/Route';
import RouterBindService from '@src/core/domains/http/router/RouterBindService';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import { app } from '@src/core/services/App';
import expressClient from 'express';

import EndRequestContextMiddleware from '../middleware/EndRequestContextMiddleware';
import RequestIdMiddleware from '../middleware/RequestIdMiddleware';
import StartSessionMiddleware from '../middleware/StartSessionMiddleware';



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

    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }

        // 1. First add request ID middleware
        this.app.use(RequestIdMiddleware.create())

        // 2. Then start session using that request ID
        this.app.use(StartSessionMiddleware.create())

        // 3. Then end request context
        this.app.use(EndRequestContextMiddleware.create())
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
     * Adds a middleware to the Express instance.
     * @param middleware - The middleware to add
     */
    public useMiddleware(middleware: TExpressMiddlewareFn | MiddlewareConstructor) {

        if (middleware.prototype instanceof Middleware) {
            this.app.use((middleware as MiddlewareConstructor).create())
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
        if (router.getRegisteredRoutes().length === 0) {
            return
        }

        this.routerBindService.setExpress(this.app, this.config)
        this.routerBindService.setOptions({ additionalMiddlewares: this.config?.globalMiddlewares ?? [] })
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

import Service from '@src/core/base/Service';
import Middleware from '@src/core/domains/express/base/Middleware';
import IExpressConfig from '@src/core/domains/express/interfaces/IExpressConfig';
import IExpressService from '@src/core/domains/express/interfaces/IExpressService';
import { MiddlewareConstructor, TExpressMiddlewareFn } from '@src/core/domains/express/interfaces/IMiddleware';
import { IRoute, IRouter, TRouteItem } from '@src/core/domains/express/interfaces/IRoute';
import EndRequestContextMiddleware from '@src/core/domains/express/middleware/deprecated/EndRequestContextMiddleware';
import RequestIdMiddlewareTest from '@src/core/domains/express/middleware/deprecated/RequestIdMiddleware';
import SecurityMiddleware from '@src/core/domains/express/middleware/SecurityMiddleware';
import Route from '@src/core/domains/express/routing/Route';
import RouterBindService from '@src/core/domains/express/services/RouterBindService';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import { app } from '@src/core/services/App';
import expressClient from 'express';

/**
 * Short hand for `app('express')`
 */
export const express = () => app('express');

/**
 * ExpressService class
 * Responsible for initializing and configuring ExpressJS
 * @implements IExpressService
 */
export default class ExpressService extends Service<IExpressConfig> implements IExpressService {

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
     */
    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }

        // Adds an identifier to the request object
        // This id is used in the requestContext service to store information over a request life cycle
        // this.app.use(requestIdMiddleware())
        this.app.use(RequestIdMiddlewareTest.toExpressMiddleware())

        // End the request context
        // This will be called when the request is finished
        // Deletes the request context and associated values
        this.app.use(EndRequestContextMiddleware.toExpressMiddleware())

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

    public bindRoutes(router: IRouter): void {
        if(router.getRegisteredRoutes().length === 0) {
            return
        }

        this.routerBindService.setExpress(this.app)
        this.routerBindService.setOptions({ additionalMiddlewares: [SecurityMiddleware] })
        this.routerBindService.bindRoutes(router)
        this.registeredRoutes.push(...router.getRegisteredRoutes())
    }

    // /**
    //  * Adds validator middleware to the route.
    //  * @param route 
    //  * @returns middlewares with added validator middleware
    //  * @deprecated This will be reworked
    //  */
    // public addValidatorMiddleware(route: IRouteLegacy): TExpressMiddlewareFn[] {
    //     return []
    //     // const middlewares: TExpressMiddlewareFn[] = [];

    //     // /**
    //     //  * Add validator middleware
    //     //  */
    //     // if (route?.validator) {
    //     //     const validatorMiddleware = validate().middleware()
    //     //     const validator = route.validator
    //     //     const validateBeforeAction = route?.validateBeforeAction ?? true

    //     //     middlewares.push(
    //     //         validatorMiddleware({ validatorConstructor: validator, validateBeforeAction })
    //     //     );
    //     // }

    //     // return middlewares;
    // }

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

import Service from '@src/core/base/Service';
import IExpressConfig from '@src/core/domains/express/interfaces/IExpressConfig';
import IExpressService from '@src/core/domains/express/interfaces/IExpressService';
import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import endCurrentRequestMiddleware from '@src/core/domains/express/middleware/endCurrentRequestMiddleware';
import requestIdMiddleware from '@src/core/domains/express/middleware/requestIdMiddleware';
import { securityMiddleware } from '@src/core/domains/express/middleware/securityMiddleware';
import SecurityRules, { SecurityIdentifiers } from '@src/core/domains/express/services/SecurityRules';
import { Middleware } from '@src/core/interfaces/Middleware.t';
import { App } from '@src/core/services/App';
import express from 'express';

/**
 * ExpressService class
 * Responsible for initializing and configuring ExpressJS
 * @implements IExpressService
 */
export default class ExpressService extends Service<IExpressConfig> implements IExpressService {

    protected config!: IExpressConfig | null;

    private app: express.Express

    private registedRoutes: IRoute[] = [];

    /**
     * Config defined in @src/config/http/express.ts
     * @param config 
     */
    constructor(config: IExpressConfig | null = null) {
        super(config)
        this.app = express()
    }

    /**
     * Initializes ExpressService by applying global middleware defined in config.
     * Global middleware is applied in the order it is defined in the config.
     */
    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }

        this.app.use(requestIdMiddleware())
        this.app.use(endCurrentRequestMiddleware())

        for (const middleware of this.config?.globalMiddlewares ?? []) {
            this.app.use(middleware);
        }
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
     * Binds multiple routes to the Express instance.
     * @param routes 
     */
    public bindRoutes(routes: IRoute[]): void {
        routes.forEach(route => {
            this.bindSingleRoute(route)
        })
    }

    /**
     * Binds a single route to the Express instance.
     * @param route 
     */
    public bindSingleRoute(route: IRoute): void {
        const userDefinedMiddlewares = route.middlewares ?? [];

        // Add security and validator middlewares
        const middlewares: Middleware[] = [
            ...userDefinedMiddlewares,
            ...this.addValidatorMiddleware(route),
            ...this.addSecurityMiddleware(route),
        ];

        // Add route handlers
        const handlers = [...middlewares, route?.action]

        // Log route
        this.logRoute(route)

        // Bind route
        switch (route.method) {
        case 'get':
            this.app.get(route.path, handlers);
            break;
        case 'post':
            this.app.post(route.path, handlers);
            break;
        case 'patch':
            this.app.patch(route.path, handlers);
            break;
        case 'put':
            this.app.put(route.path, handlers);
            break;
        case 'delete':
            this.app.delete(route.path, handlers);
            break;
        default:
            throw new Error(`Unsupported method ${route.method} for path ${route.path}`);
        }

        this.registedRoutes.push(route)
    }

    /**
     * Adds validator middleware to the route.
     * @param route 
     * @returns middlewares with added validator middleware
     */
    public addValidatorMiddleware(route: IRoute): Middleware[] {
        const middlewares: Middleware[] = [];

        /**
         * Add validator middleware
         */
        if (route?.validator) {
            const validatorMiddleware = App.container('validate').middleware()
            const validator = new route.validator();
            const validateBeforeAction = route?.validateBeforeAction ?? true

            middlewares.push(
                validatorMiddleware({ validator, validateBeforeAction })
            );
        }

        return middlewares;
    }

    /**
     * Adds security middleware to the route. If the route has scopesSecurityEnabled
     * and scopes is present, it adds the HAS_SCOPE security rule to the route.
     * Then it adds the security middleware to the route's middleware array.
     * @param route The route to add the middleware to
     * @returns The route's middleware array with the security middleware added
     */
    public addSecurityMiddleware(route: IRoute): Middleware[] {
        const middlewares: Middleware[] = [];

        /**
         * Check if scopes is present, add related security rule
         */
        if (route?.scopesSecurityEnabled && route?.scopes?.length) {
            route.security = [
                ...(route.security ?? []),
                SecurityRules[SecurityIdentifiers.HAS_SCOPE](route.scopes)
            ]
        }

        /**
                 * Add security middleware
                 */
        if (route?.security) {
            middlewares.push(
                securityMiddleware({ route })
            )
        }

        return middlewares;
    }

    /**
     * Returns the Express instance.
     */
    public getExpress(): express.Express {
        return this.app
    }

    /**
     * Checks if Express is enabled.
     * @returns true if enabled, false otherwise.
     */
    public isEnabled(): boolean {
        return this.config?.enabled ?? false
    }

    /**
     * Returns all registered routes.
     * @returns array of IRoute
     */
    public getRoutes(): IRoute[] {
        return this.registedRoutes
    }

    /**
     * Logs a route binding to the console.
     * @param route - IRoute instance
     */
    private logRoute(route: IRoute): void {
        let str = `[Express] binding route ${route.method.toUpperCase()}: '${route.path}' as '${route.name}'`;

        if (route.scopes?.length) {
            str += ` with scopes: [${route.scopes.join(', ')}]`

            if (route?.scopesSecurityEnabled) {
                str += ' (scopes security ON)'
            }
            else {
                str += ' (scopes security OFF)'
            }
        }

        console.log(str)
    }

}

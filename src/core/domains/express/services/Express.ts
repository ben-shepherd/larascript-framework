import express from 'express';

import Service from '@src/core/base/Service';
import IExpress from '@src/core/domains/express/interfaces/IExpress';
import IExpressConfig from '@src/core/domains/express/interfaces/IExpressConfig';
import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import { Middleware } from '@src/core/interfaces/Middleware.t';
import { App } from '@src/core/services/App';

export default class Express extends Service<IExpressConfig> implements IExpress {
    protected config!: IExpressConfig | null;
    private app: express.Express
    className: string = 'Express';
    
    /**
     * Config defined in @src/config/http/express.ts
     * @param config 
     */
    constructor(config: IExpressConfig | null = null) {
        super(config)
        this.app = express()
    }

    /**
     * init
     * Apply global middleware 
     */
    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }
        for (const middleware of this.config?.globalMiddlewares ?? []) {
            this.app.use(middleware);
        }
    }

    /**
     * Start listening for connections
     */
    public async listen(): Promise<void>
    {   
        const port =  this.config?.port
        
        return new Promise(resolve => {
            this.app.listen(port, () => resolve())
        })
    }

    /**
     * Bind Routes
     * @param routes 
     */
    public bindRoutes(routes: IRoute[]): void {
        routes.forEach(route => {
            this.bindSingleRoute(route)
        })
    }

    /**
     * Bind Route
     * @param route 
     */
    public bindSingleRoute(route: IRoute): void 
    {
        const middlewares = this.addValidatorMiddleware(route);
        const handlers = [...middlewares, route?.action]

        console.log(`[Express] binding route ${route.method.toUpperCase()}: '${route.path}' as '${route.name}'`)

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
    }

    /**
     * Adds validator middleware
     * @param route 
     * @returns 
     */
    public addValidatorMiddleware(route: IRoute): Middleware[]
    {
        const middlewares = [...route?.middlewares ?? []];

        if (route?.validator) {
            const validator = new route.validator();
            const validatorMiddleware = App.container('validate').middleware()

             middlewares.push(
                validatorMiddleware(validator)
             );
        }

        return middlewares;
    }

    /**
     * Get the express instance
     */
    public getApp(): express.Express {
        return this.app
    }
}
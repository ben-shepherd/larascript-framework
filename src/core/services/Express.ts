import express from 'express';

import Service from '../base/Service';
import IExpress from '../interfaces/http/IExpress';
import IExpressConfig from '../interfaces/http/IExpressConfig';
import { IRoute } from '../interfaces/http/IRoute';

export default class Express extends Service<IExpressConfig> implements IExpress {
    protected config!: IExpressConfig | null;
    private app: express.Express
    private server;
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
            console.log('Express loaded middleware', middleware);
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
     * Bind routes
     */
    public bindRoutes(routes: IRoute[]): void {
        routes.forEach(route => {
            const middlewares = route?.middlewares ?? []
            const handlers = [...middlewares, route?.action]

            console.log(`[Express] binding route ${route.method.toUpperCase()}: '${route.path}' as '${route.name}'`)

            switch (route.method) {
                case 'get':
                    this.app.get(route.path, handlers);
                    break;
                case 'post':
                    this.app.post(route.path, handlers);
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
        })
    }

    /**
     * Get the express instance
     */
    public getApp(): express.Express {
        return this.app
    }
}
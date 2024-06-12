import express from 'express';

import Singleton from '../base/Singleton';
import IExpressConfig from '../interfaces/IExpressConfig';
import { Route } from '../interfaces/IRoute';

export default class Express extends Singleton<IExpressConfig> {
    protected config!: IExpressConfig | null;
    private app: express.Express
    
    constructor(config: IExpressConfig | null = null) {
        super(config)
        this.config = config
        this.app = express()
    }

    public init() {
        if (!this.config) {
            throw new Error('Config not provided');
        }
        for (const middleware of this.config?.globalMiddlewares ?? []) {
            console.log('Express loaded middleware', middleware);
            this.app.use(middleware);
        }
    }

    public async listen(): Promise<void>
    {   
        const port =  this.config?.port
        
        return new Promise(resolve => {
            this.app.listen(port, () => resolve())
        })
    }

    public bindRoutes(routes: Route[]): void {
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

    public getApp(): express.Express {
        return this.app
    }
}
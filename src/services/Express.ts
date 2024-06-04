import express from 'express';

import { IRoute } from '../interfaces/IRoute';
import IExpressConfig from '../interfaces/IExpressConfig';

export default class Express {
    private static instance: Express;
    private config!: IExpressConfig;
    private app: express.Express
    
    private constructor(config: IExpressConfig) {
        this.config = config
        this.app = express()
        this.init()
    }

    public init() {
        for(const middleware of this.config.globalMiddlewares ?? []) {
            this.app.use(middleware)
        }
    }

    public async listen(): Promise<void>
    {
        const port =  this.config.port
        
        return new Promise(resolve => {
            this.app.listen(port, () => resolve())
        })
    }

    public bindRoutes(routes: IRoute[]): void {
        routes.forEach(route => {
            const middlewares = route?.middlewares ?? []
            const handlers = [...middlewares, route?.action]

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

    public static getApp(): express.Express
    {
        return this.getInstance().app
    }

    public static getInstance(config: IExpressConfig | null = null): Express {
        if (!Express.instance && config) {
            Express.instance = new Express(config);
        }

        if (!Express.instance) {
            throw new Error('Express instance not created');
        }

        return Express.instance;
    }
}
import express from "express";
import routes from "../routes";

export default class Express {
    private static instance: Express;
    private app: express.Express
    
    private constructor() {
        this.app = express()
        this.init()
    }

    init() {
        // Apply middleware
        this.app.use(express.json());
    
        // Apply routes
        this.initRoutes()

        // Listen
        this.listen()
    }

    private listen(): void
    {
        const port =  process.env.APP_PORT ?? 3000

        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }

    private initRoutes (): void {
        const app = this.app
        Object.values(routes).forEach(route => {
            const middlewares = route?.middlewares ?? []
            const handlers = [...middlewares, route?.handler]

            switch (route.method) {
                case 'get':
                    app.get(route.path, handlers);
                    break;
                case 'post':
                    app.post(route.path, handlers);
                    break;
                case 'put':
                    app.put(route.path, handlers);
                    break;
                case 'delete':
                    app.delete(route.path, handlers);
                    break;
                default:
                    throw new Error(`Unsupported method ${route.method} for path ${route.path}`);
            }
        });
    }

    public static getApp(): express.Express
    {
        return this.getInstance().app
    }

    public static getInstance(): Express {
        if (!Express.instance) {
            Express.instance = new Express();
        }
        return Express.instance;
    }
}
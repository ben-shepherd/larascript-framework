import express from "express";
import routes from "../routes";

export default class Express {
    private static instance: Express;
    private app: express.Express
    
    private constructor() {
        this.app = express()
        this.init()
    }

    init()
    {
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
            switch (route.method) {
                case 'get':
                    app.get(route.path, route.handler);
                    break;
                case 'post':
                    app.post(route.path, route.handler);
                    break;
                case 'put':
                    app.put(route.path, route.handler);
                    break;
                case 'delete':
                    app.delete(route.path, route.handler);
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
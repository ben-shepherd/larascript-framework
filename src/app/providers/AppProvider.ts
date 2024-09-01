import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import ExpressProvider from "@src/core/domains/express/providers/ExpressProvider";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";

export interface AppConfig {}

export default class AppProvider extends BaseProvider
{
    protected config: AppConfig = {};

    public async register(): Promise<void> 
    {
        this.log('Registering AppProvider');

        /**
         * Register your services here
         */
    }

    public async boot(): Promise<void> 
    {
        this.log('Booting AppProvider');

        /**
         * Bind routes to Express
         */
        this.routes();

        /**
         * Boot your services here
         */
        // App.setContainer('myService', new MyService(this.config));
    }

    /**
     *  Setup routing files
     */
    private routes(): void
    {
        if(!Kernel.isProviderReady(ExpressProvider.name)) {
            return;
        }
        
        App.container('express').bindRoutes(apiRoutes);
    }
}
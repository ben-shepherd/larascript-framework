import apiRoutes from '@src/app/routes/api';
import healthRoute from '@src/core/routes/health';
import BaseProvider from "../base/Provider";
import Kernel from "../kernel";
import { App } from '../services/App';
import ExpressProvider from "./ExpressProvider";

export default class RoutesProvider extends BaseProvider
{
    public async register(): Promise<void> {
        this.log('Registering RoutesProvider');
    }

    public async boot(): Promise<void> {
        if(!Kernel.isProviderReady(ExpressProvider.name)) {
            throw new Error('ExpressProvider must be loaded before RoutesProvider');
        }

        this.log('Booting RoutesProvider');
        
        /**
         * Register routes in @src/app/routes/api
         */
        this.registerApiRoutes();

        /**
         * Register routes in @src/core/routes/health
         */
        this.registerHealthRoute();
    }

    private registerApiRoutes(): void {
        App.container('express').bindRoutes(apiRoutes);
    }

    private registerHealthRoute(): void {
        App.container('express').bindRoutes(healthRoute);
    }
}
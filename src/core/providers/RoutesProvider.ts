import expressConfig from '@config/http/express';
import apiRoutes from '@src/app/routes/api';
import healthRoute from '@src/core/routes/health';
import BaseProvider from "../base/Provider";
import IExpressConfig from '../interfaces/http/IExpressConfig';
import Kernel from "../kernel";
import { App } from '../services/App';
import ExpressProvider from "./ExpressProvider";

export default class RoutesProvider extends BaseProvider
{
    protected config: IExpressConfig = expressConfig;
    
    public async register(): Promise<void> {
        if(!this.config.enabled) {
            return;
        }

        this.log('Registering RoutesProvider');
    }

    public async boot(): Promise<void> {
        if(!this.config.enabled) {
            return;
        }
        
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
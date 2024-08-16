import expressConfig from '@config/http/express';
import apiRoutes from '@src/app/routes/api';
import BaseProvider from "@src/core/base/Provider";
import IExpressConfig from '@src/core/domains/express/interfaces/IExpressConfig';
import Kernel from "@src/core/Kernel";
import ExpressProvider from "@src/core/providers/ExpressProvider";
import healthRoute from '@src/core/routes/health';
import { App } from '@src/core/services/App';

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
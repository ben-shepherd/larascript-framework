import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import ExpressProvider from "@src/core/domains/express/providers/ExpressProvider";
import healthRoutes from "@src/core/domains/express/routes/healthRoutes";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";
import AppService from "@src/app/services/AppService";

/**
 * AppProvider class
 * Extends BaseProvider to provide application-specific functionality
 */
export default class AppProvider extends BaseProvider {

    /**
     * Register Services
     * 
     * @returns Promise<void>
     */
    public async register(): Promise<void> {

        // Register the AppService in the App container
        App.setContainer('app', new AppService(this.config));
    }

    /**
     * Boot method
     * Called after all providers have been registered
     * Use this method to perform any actions that require other services to be available
     * @returns Promise<void>
     */
    public async boot(): Promise<void> {

        // Bind routes to Express
        this.addApiRoutes();

        // Boot your services here
        // Example of setting a service in the App container:
        // Example: app('myService').someBootMethod();
    }

    /**
     * Setup routing files
     * Binds API routes to the Express instance if ExpressProvider is ready
     * @private
     */
    private addApiRoutes(): void {

        // Check if ExpressProvider is ready before binding routes
        if(!Kernel.isProviderReady(ExpressProvider.name)) {
            return;
        }

        const expressService = App.container('express');
        const authService = App.container('auth');
        
        // Bind routes
        expressService.bindRoutes(healthRoutes);
        expressService.bindRoutes(authService.getAuthRoutes() ?? [])
        expressService.bindRoutes(apiRoutes);
    }

}

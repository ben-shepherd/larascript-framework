import BaseProvider from "@src/core/base/Provider";
import ExpressProvider from "@src/core/domains/express/providers/ExpressProvider";
import healthRoutes from "@src/core/domains/express/routes/healthRoutes";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";
import apiRoutes from "@src/app/routes/api";

/**
 * AppProvider class
 * Extends BaseProvider to provide application-specific functionality
 */
export default class AppProvider extends BaseProvider {

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     * @returns Promise<void>
     */
    public async register(): Promise<void> {
        this.log('Registering AppProvider');

        // Register your services here
        // Example:App.setContainer('serviceKey', new ServiceClass(this.config));
    }

    /**
     * Boot method
     * Called after all providers have been registered
     * Use this method to perform any actions that require other services to be available
     * @returns Promise<void>
     */
    public async boot(): Promise<void> {
        this.log('Booting AppProvider');

        // Bind routes to Express
        this.addApiRoutes();

        // Boot your services here
        // Example of setting a service in the App container:
        // Example: App.setContainer('myService').someBootMethod();
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

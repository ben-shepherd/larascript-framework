import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import healthRoutes from "@src/core/domains/express/routes/healthRoutes";
import { app } from "@src/core/services/App";

class RoutesProvider extends BaseProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const expressService = app('express');
        const authService = app('auth');

        // Bind routes
        expressService.bindRoutes(authService.getAuthRoutes() ?? [])
        expressService.bindRoutes(healthRoutes);
        expressService.bindRoutes(apiRoutes);

        // Add more routes here

    }

}


export default RoutesProvider;
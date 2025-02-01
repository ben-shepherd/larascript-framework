import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import healthRoutes from "@src/core/domains/express/routes/healthRoutes";
import Router from "@src/core/domains/express/routing/Router";
import { app } from "@src/core/services/App";


class RoutesProvider extends BaseProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const expressService = app('express');
        const authService = app('auth');
        const authRouter = authService.getAuthRoutes();

        // Bind routes
        expressService.bindRoutes(authRouter ?? new Router())
        expressService.bindRoutes(healthRoutes);
        expressService.bindRoutes(apiRoutes);

        // Add more routes here

    }

}


export default RoutesProvider;
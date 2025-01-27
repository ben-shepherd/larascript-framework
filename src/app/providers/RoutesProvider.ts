import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import healthRoutes from "@src/core/domains/express/routes/healthRoutes";
import { app } from "@src/core/services/App";

import blogsRoutes from "../routes/blogsRoutes";
import blogRoutesLegacy from "../routes/blogsRoutesLegacy";

class RoutesProvider extends BaseProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const expressService = app('express');
        const authService = app('auth');

        // Bind routes
        expressService.bindRoutesLegacy(authService.getAuthRoutes() ?? [])
        expressService.bindRoutesLegacy(healthRoutes);
        expressService.bindRoutesLegacy(apiRoutes);

        // expressService.bindRoutes(helloWorldRoutes);
        expressService.bindRoutesLegacy(blogRoutesLegacy);
        expressService.bindRoutes(blogsRoutes);

        // Add more routes here

    }

}


export default RoutesProvider;
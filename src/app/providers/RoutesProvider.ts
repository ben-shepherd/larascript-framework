import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import healthRoutes from "@src/core/domains/http/routes/healthRoutes";
import { app } from "@src/core/services/App";



class RoutesProvider extends BaseProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const expressService = app('express');
        
        // Bind routes
        expressService.bindRoutes(app('auth').getAuthRoutes())
        expressService.bindRoutes(healthRoutes);
        expressService.bindRoutes(apiRoutes);

    }

}


export default RoutesProvider;
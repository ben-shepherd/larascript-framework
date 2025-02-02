import apiRoutes from "@src/app/routes/api";
import BaseProvider from "@src/core/base/Provider";
import healthRoutes from "@src/core/domains/http/routes/healthRoutes";
import { app } from "@src/core/services/App";



class RoutesProvider extends BaseProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const httpService = app('http');
        
        // Bind routes
        httpService.bindRoutes(app('auth').getAuthRoutes())
        httpService.bindRoutes(healthRoutes);
        httpService.bindRoutes(apiRoutes);

    }

}


export default RoutesProvider;
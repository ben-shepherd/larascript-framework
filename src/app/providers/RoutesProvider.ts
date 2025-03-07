import apiRoutes from "@src/app/routes/api";
import CsrfMiddleware from "@src/core/domains/auth/middleware/CsrfMiddlware";
import { authJwt } from "@src/core/domains/auth/services/JwtAuthService";
import BaseRoutesProvider from "@src/core/domains/http/providers/BaseRoutesProvider";
import healthRoutes from "@src/core/domains/http/routes/healthRoutes";
import { app } from "@src/core/services/App";


class RoutesProvider extends BaseRoutesProvider {

    /**
     * Registers the routes to the express service
     */
    public async boot(): Promise<void> {

        const httpService = app('http');
        
        // Bind routes
        httpService.bindRoutes(authJwt().getRouter())
        httpService.bindRoutes(CsrfMiddleware.getRouter())
        httpService.bindRoutes(healthRoutes);
        httpService.bindRoutes(apiRoutes);

    }


}


export default RoutesProvider;
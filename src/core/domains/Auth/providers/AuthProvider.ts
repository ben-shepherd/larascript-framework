
import authConfig from '@src/config/auth';
import BaseProvider from "@src/core/base/Provider";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import authRoutes from '@src/core/domains/auth/routes/auth';
import ExpressProvider from "@src/core/domains/express/providers/ExpressProvider";
import Kernel from "@src/core/Kernel";
import { App } from "@src/core/services/App";

export default class AuthProvider extends BaseProvider
{
    protected config: IAuthConfig = authConfig;

    public async register(): Promise<void> {

        this.log('Registering AuthProvider');

        /**
         * Setup the registed authService
         */
        const authServiceCtor = this.config.service.authService;
        const authService = new authServiceCtor(this.config);

        /**
         * Setup the container
         */
        App.setContainer('auth', authService);
    }

    public async boot(): Promise<void> {

        this.log('Booting AuthProvider');

        /**
         * Register the authentication routes
         */
        const expressEnabled = Kernel.isProviderReady(ExpressProvider.name) && App.container('express').isEnabled();
        const enableAuthRoutes = this.config.enableAuthRoutes;
        
        if(expressEnabled && enableAuthRoutes) {
            this.registerAuthRoutes();
        }
    }

    /**
     * Provide the authentication routes
     */
    private registerAuthRoutes(): void {
        let routes = authRoutes(this.config) 

        if(!this.config.enableAuthRoutesAllowCreate) { 
            routes = [
                ...routes.filter((route) => route.name !== 'authCreate'),
            ]
        }

        App.container('express').bindRoutes(routes);
    }
}

import authConfig from '@config/auth/auth';
import expressConfig from '@config/http/express';
import BaseProvider from "@src/core/base/Provider";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import authRoutes from '@src/core/domains/auth/routes/auth';
import Kernel from "@src/core/Kernel";
import ExpressProvider from "@src/core/providers/ExpressProvider";
import { App } from "@src/core/services/App";
import BaseAuthService from '../domains/auth/services/BaseAuthService';

export default class AuthProvider extends BaseProvider
{
    protected config: IAuthConfig = authConfig;

    public async register(): Promise<void> {

        this.log('Registering AuthProvider');

        /**
         * Setup the registed authService
         */
        const authService = new BaseAuthService(this.config)
        App.setContainer('auth', authService);
    }

    public async boot(): Promise<void> {

        this.log('Booting AuthProvider');

        /**
         * Register the authentication routes
         */
        if(expressConfig.enabled && this.config.enableAuthRoutes && Kernel.isProviderReady(ExpressProvider.name)) {
            this.registerAuthRoutes();
        }
    }

    private registerAuthRoutes(): void {
        let authRoutesArray = [...authRoutes]

        if(!this.config.enableAuthRoutesAllowCreate) { 
            authRoutesArray = [
                ...authRoutesArray.filter((route) => route.name !== 'authCreate'),
            ]
        }

        App.container('express').bindRoutes(authRoutesArray);
    }
}
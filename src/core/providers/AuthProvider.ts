
import authConfig from '@config/auth/auth';
import BaseProvider from "../base/Provider";
import { IAuthConfig } from "../domains/auth/interfaces/IAuthConfig";
import authRoutes from '../domains/auth/routes/auth';
import Kernel from "../kernel";
import { App } from "../services/App";
import ExpressProvider from "./ExpressProvider";

export default class AuthProvider extends BaseProvider
{
    protected config: IAuthConfig = authConfig;

    public async register(): Promise<void> {

        this.log('Registering AuthProvider');

        /**
         * Setup the registed authService
         */
        const authServiceConstructor = this.config.authService;
        const authService = new authServiceConstructor(this.config)
        App.setContainer('auth', authService);
    }

    public async boot(): Promise<void> {

        this.log('Booting AuthProvider');

        /**
         * Register the authentication routes
         */
        if(Kernel.isProviderReady(ExpressProvider.name) &&this.config.authRoutes) {
            this.registerAuthRoutes();
        }
    }

    private registerAuthRoutes(): void {
        let authRoutesArray = [...authRoutes]

        if(!this.config.authCreateAllowed) { 
            authRoutesArray = [
                ...authRoutesArray.filter((route) => route.name !== 'authCreate'),
            ]
        }

        App.container('express').bindRoutes(authRoutesArray);
    }
}
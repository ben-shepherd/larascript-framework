
import BaseProvider from "../base/Provider";
import { IAuthConfig } from "../domains/auth/interfaces/IAuthConfig";
import authRoutes from '../domains/auth/routes/auth';
import Kernel from "../kernel";
import { App } from "../services/App";
import Express from "../services/Express";
import ExpressProvider from "./ExpressProvider";

export default class AuthProvider extends BaseProvider
{
    protected config!: IAuthConfig;
    configPath = '@config/auth/auth';

    constructor() {
        super()
        this.init()
    }

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
         * Register the authentication
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

        Express.getInstance().bindRoutes(authRoutesArray);
    }
}
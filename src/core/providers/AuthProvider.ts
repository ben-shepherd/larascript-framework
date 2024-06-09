
import BaseProvider from "../base/Provider";
import authRoutes from '../domains/auth/routes/auth'
import Provider from "../services/Express";
import { IAuthConfig } from "../interfaces/IAuthConfig";
import Kernel from "../kernel";
import ExpressProvider from "./ExpressProvider";
import Auth from "../domains/auth/services/Auth";

export default class AuthProvider extends BaseProvider
{
    protected config!: IAuthConfig;
    configPath = 'src/config/auth/auth';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering AuthProvider');
    }

    public async boot(): Promise<void> {

        this.log('Booting AuthProvider');
        
        this.setupAuthService()

        if(Kernel.isProviderReady(ExpressProvider.name) &&this.config.authRoutes) {
            this.registerAuthRoutes();
        }
    }

    private setupAuthService(): void {
        Auth.getInstance(this.config)
    }

    private registerAuthRoutes(): void {
        let authRoutesArray = [...authRoutes]

        if(!this.config.authCreateAllowed) { 
            authRoutesArray = [
                ...authRoutesArray.filter((route) => route.name !== 'authCreate'),
            ]
        }

        Provider.getInstance().bindRoutes(authRoutesArray);
    }
}
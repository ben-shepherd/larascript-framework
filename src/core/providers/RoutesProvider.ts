import { IRoutesConfig } from "../interfaces/IRoutesConfig";
import BaseProvider from "../base/Provider";
import authRoutes from '../domains/Auth/routes/auth'
import apiRoutes from '../routes/api';
import Provider from "../services/Express";

export default class RoutesProvider extends BaseProvider
{
    protected config!: IRoutesConfig;
    configPath = 'src/config/http/routes';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering RoutesProvider');

        this.registerApiRoutes();
        this.registerAuthRoutes();
    }

    public async boot(): Promise<void> {
        this.log('Booting RoutesProvider');
    }

    private registerApiRoutes(): void {
        Provider.getInstance().bindRoutes(apiRoutes);
    }

    private registerAuthRoutes(): void {
        let authRoutesArray = [...authRoutes]

        if(!this.config.authRoutes) {
            return;
        }

        if(!this.config.authCreateAllowed) { 
            authRoutesArray = [
                ...authRoutesArray.filter((route) => route.name !== 'authCreate'),
            ]
        }

        Provider.getInstance().bindRoutes(authRoutesArray);
    }
}
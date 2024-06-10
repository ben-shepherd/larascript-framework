import BaseProvider from "../base/Provider";
import { IRoutesConfig } from "../interfaces/IRoutesConfig";
import Kernel from "../kernel";
import apiRoutes from '../routes/api';
import Provider from "../services/Express";
import ExpressProvider from "./ExpressProvider";

export default class RoutesProvider extends BaseProvider
{
    protected config!: IRoutesConfig;
    configPath = '@config/http/routes';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering RoutesProvider');
    }

    public async boot(): Promise<void> {
        if(!Kernel.isProviderReady(ExpressProvider.name)) {
            throw new Error('ExpressProvider must be loaded before RoutesProvider');
        }

        this.log('Booting RoutesProvider');
        
        this.registerApiRoutes();
    }

    private registerApiRoutes(): void {
        Provider.getInstance().bindRoutes(apiRoutes);
    }
}
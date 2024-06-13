import BaseProvider from '@src/core/base/Provider';
import { IAuthConfig } from '@src/core/interfaces/IAuthConfig';

    /**
     * @example AppProvider
     * 
     * Provide routing for Express
     * 
     * [Example]
     *      Express.getInstance().bindRoutes(weatherRoutes)
     * 
     */
export default class AppRouteProvider extends BaseProvider
{
    protected config!: IAuthConfig;
    configPath = null

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering RouteProvider');
    }

    public async boot(): Promise<void> {
        this.log('Booting RouteProvider');
    }
}
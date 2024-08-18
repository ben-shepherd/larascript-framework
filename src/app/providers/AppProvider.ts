import BaseProvider from "@src/core/base/Provider";

export interface AppConfig {}

export default class AppProvider extends BaseProvider
{
    protected config: AppConfig = {};

    public async register(): Promise<void> 
    {
        this.log('Registering AppProvider');

        /**
         * Register your services here
         */
    }

    public async boot(): Promise<void> 
    {
        this.log('Booting AppProvider');

        /**
         * Boot your services here
         */
    }
}
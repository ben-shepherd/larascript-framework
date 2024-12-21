import AppProvider from '@src/app/providers/AppProvider';
import { EnvironmentDevelopment, EnvironmentType } from '@src/core/consts/Environment';
import IAppConfig from '@src/core/interfaces/IAppConfig';
import LarascriptProviders from '@src/core/providers/LarascriptProviders';

/**
 * Available app configuration
 */
const appConfig: IAppConfig = {

    /**
     * The environment the app is running in
     */
    environment: (process.env.APP_ENV as EnvironmentType) ?? EnvironmentDevelopment,
    
    /**
     * Providers
     * @deprecated Use the providers.ts file instead (TODO)
     */
    providers: [

        /**
         * Include the core providers
         */
        ...LarascriptProviders,

        /**
         * Add your providers below
         */
        new AppProvider(),
    ]
};

export default appConfig;

import AppProvider from '@src/app/providers/AppProvider';
import { EnvironmentDevelopment, EnvironmentType } from '@src/core/consts/Environment';
import IAppConfig from '@src/core/interfaces/IAppConfig';
import CoreProviders from '@src/core/providers/CoreProviders';

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
     */
    providers: [

        /**
         * Include the core providers
         */
        ...CoreProviders,

        /**
         * Add your providers below
         */
        new AppProvider(),
    ]
};

export default appConfig;

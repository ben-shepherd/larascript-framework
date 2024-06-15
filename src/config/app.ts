import AppProvider from '@src/app/providers/AppProvider';
import AppRouteProvider from '@src/app/providers/AppRouteProvider';
import EventProvider from '@src/core/providers/EventProvider';
import { EnvironmentType } from '../core/consts/Environment';
import IAppConfig from '../core/interfaces/IAppConfig';
import AuthProvider from '../core/providers/AuthProvider';
import ExpressProvider from '../core/providers/ExpressProvider';
import MongoDBProvider from '../core/providers/MongoDBProvider';
import { default as CoreRoutesProvider } from '../core/providers/RoutesProvider';

/**
 * Available app configuration
 */
const appConfig: IAppConfig = {
    /**
     * The environment the app is running in
     */
    environment: (process.env.APP_ENV as EnvironmentType) ?? 'development',
    
    /**
     * Service providers
     */
    providers: [
        /**
         * Core providers
         */
        new EventProvider(),
        new MongoDBProvider(),
        new ExpressProvider(),
        new CoreRoutesProvider(),
        new AuthProvider(),
        // new ExpressListenerProvider(),
        /**
         * Add your providers below
         */
        new AppProvider(),
        new AppRouteProvider()
    ],
};

export default appConfig;

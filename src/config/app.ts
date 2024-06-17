import TestCommand from '@src/app/commands/TestCommand';
import AppProvider from '@src/app/providers/AppProvider';
import EventProvider from '@src/core/domains/events/providers/EventProvider';
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
        /**
         * Add your providers below
         */
        new AppProvider(),
    ],

    /**
     * Commands
     */
    commands: [
        TestCommand,
    ]
};

export default appConfig;

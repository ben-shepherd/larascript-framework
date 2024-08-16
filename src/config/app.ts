import ExampleCommand from '@src/app/commands/ExampleCommand';
import AppProvider from '@src/app/providers/AppProvider';
import ConsoleProvider from '@src/core/domains/console/providers/ConsoleProvider';
import EventProvider from '@src/core/domains/events/providers/EventProvider';
import { EnvironmentType } from '../core/consts/Environment';
import AuthProvider from '../core/domains/auth/providers/AuthProvider';
import ExpressProvider from '../core/domains/express/providers/ExpressProvider';
import { default as CoreRoutesProvider } from '../core/domains/express/providers/RoutesProvider';
import IAppConfig from '../core/interfaces/IAppConfig';
import MongoDBProvider from '../core/providers/MongoDBProvider';

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
        new ConsoleProvider(),
        /**
         * Add your providers below
         */
        new AppProvider(),
    ],

    /**
     * Commands
     */
    commands: [
        ExampleCommand,
    ]
};

export default appConfig;

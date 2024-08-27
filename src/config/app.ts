import ExampleCommand from '@src/app/commands/ExampleCommand';
import AppProvider from '@src/app/providers/AppProvider';
import { EnvironmentType } from '@src/core/consts/Environment';
import AuthProvider from '@src/core/domains/auth/providers/AuthProvider';
import ConsoleProvider from '@src/core/domains/console/providers/ConsoleProvider';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import EventProvider from '@src/core/domains/events/providers/EventProvider';
import ExpressProvider from '@src/core/domains/express/providers/ExpressProvider';
import { default as CoreRoutesProvider } from '@src/core/domains/express/providers/RoutesProvider';
import MakeProvider from '@src/core/domains/make/providers/MakeProvider';
import ValidatorProvider from '@src/core/domains/validator/providers/ValidatorProvider';
import IAppConfig from '@src/core/interfaces/IAppConfig';

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
        new DatabaseProvider(),
        new ExpressProvider(),
        new CoreRoutesProvider(),
        new AuthProvider(),
        new ConsoleProvider(),
        new MakeProvider(),
        new ValidatorProvider(),
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

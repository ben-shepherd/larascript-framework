import { AppAuthService } from '@src/app/services/AppAuthService';
import MongoDBConnection from '@src/core/domains/database/services/MongoDBConnection';
import EventDispatcher from '@src/core/events/EventDispatcher';
import EventProvider from '@src/core/providers/EventProvider';
import { EnvironmentType } from '../core/consts/Environment';
import IAppConfig from '../core/interfaces/IAppConfig';
import AuthProvider from '../core/providers/AuthProvider';
import ExpressListenerProvider from '../core/providers/ExpressListenerProvider';
import ExpressProvider from '../core/providers/ExpressProvider';
import MongoDBProvider from '../core/providers/MongoDBProvider';
import RoutesProvider from '../core/providers/RoutesProvider';

/**
 * ContainersTypeHelpers allows you to access the services stored in the containers by providing type hinting.
 * 
 * In your provider, set a container by utilising the Kernel.setContainer(name: string, container: any) method 
 * Example:
 * Kernel.setContainer('auth', new AppAuthService())
 * 
 * Retrieving the container using App global helper
 * Example: 
 * const token = await App.contantainer('auth').createToken(user)
 */
export interface ContainersTypeHelpers {
    [key: string]: any,
    /**
     * Auth service
     */
    auth: AppAuthService,
    /**
     * MongoDB for the default connection
     */
    mongodb: MongoDBConnection
    /**
     * Dispatch events
     */
    events: EventDispatcher,
}

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
        new EventProvider(),
        new MongoDBProvider(),
        new ExpressProvider(),
        new RoutesProvider(),
        new AuthProvider(),
        new ExpressListenerProvider(),
    ],
};

export default appConfig;

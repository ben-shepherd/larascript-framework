import ICommandService from '@src/core/domains/Console/interfaces/ICommandService';
import { IMongoDB } from '@src/core/domains/Database/mongodb/interfaces/IMongoDB';
import { IEventService } from '@src/core/domains/events/interfaces/IEventService';
import IExpress from '@src/core/interfaces/http/IExpress';
import { AuthConfigTypeHelpers } from './auth/auth';

/**
 * ContainersTypeHelpers provides type hinting when accessing a container. 
 *
 * [How to set a container]
 *   In your provider, set a container by utilising the Kernel.setContainer(name: string, container: any) method
 *   Example:
 *   Kernel.setContainer('auth', new AppAuthService())
 *
 * [Retrieving a container]
 *   Retrieving the container using App global helper
 *   Example:
 *   const token = await App.container('auth').createToken(user)
 */

export interface ContainersTypeHelpers {
    [key: string]: any;
    /**
     * Event Dispatcher Service
     * Provided by '@src/core/providers/EventProvider'
     */
    events: IEventService;
    /**
     * Auth service
     * Provided by '@src/core/providers/AuthProvider'
     */
    auth: AuthConfigTypeHelpers['authService'];
    /**
     * MongoDB Service
     * Provided by '@src/core/providers/MongoDBProvider'
     */
    mongodb: IMongoDB;
    /**
     * Express web server Service
     * Provided by '@src/core/providers/ExpressProvider'
     */
    express: IExpress;
    /**
     * Console service
     * Provided by '@src/core/domains/console/providers/ConsoleProvider'
     */
    console: ICommandService
}

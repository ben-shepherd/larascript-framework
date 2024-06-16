import { IMongoDB } from '@src/core/domains/database/mongodb/interfaces/IMongoDB';
import { IEventDispatcher } from '@src/core/domains/events/interfaces/IEventDispatcher';
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
 *   const token = await App.contantainer('auth').createToken(user)
 */

export interface ContainersTypeHelpers {
    [key: string]: any;
    /**
     * Event Dispatcher Service
     * Provided by '@src/core/providers/EventProvider'
     */
    events: IEventDispatcher;
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
}

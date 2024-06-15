import { AppAuthService } from '@src/app/services/AppAuthService';
import { IMongoDB } from '@src/core/domains/database/mongodb/interfaces/IMongoDB';
import EventDispatcher from '@src/core/events/EventDispatcher';
import IExpress from '@src/core/interfaces/http/IExpress';

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
     * Dispatch events
     */
    events: EventDispatcher;
    /**
     * Auth service
     */
    auth: AppAuthService;
    /**
     * MongoDB for the default connection
     */
    mongodb: IMongoDB;
    /**
     * Express web server
     */
    express: IExpress;
}

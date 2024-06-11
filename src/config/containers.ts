import { AppAuthService } from '@src/app/services/AppAuthService';
import MongoDBConnection from '@src/core/domains/database/services/MongoDBConnection';
import EventDispatcher from '@src/core/events/EventDispatcher';
import { Express } from 'express';

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
    mongodb: MongoDBConnection;
    /**
     * Express web server
     */
    express: Express;
}

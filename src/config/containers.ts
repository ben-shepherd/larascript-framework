import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import ICommandService from '@src/core/domains/console/interfaces/ICommandService';
import { IMongoDB } from '@src/core/domains/database/mongodb/interfaces/IMongoDB';
import { IEventService } from '@src/core/domains/events/interfaces/IEventService';
import IExpress from '@src/core/domains/express/interfaces/IExpress';
import IValidatorService from '@src/core/domains/validator/interfaces/IValidatorService';

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
    auth: IAuthService;
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
    console: ICommandService;
    /**
     * Validator service
     * Provided by '@src/core/domains/validator/providers/ValidatorProvider'
     */
    validator: IValidatorService;
}

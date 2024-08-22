import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import ICommandService from '@src/core/domains/console/interfaces/ICommandService';
import { IMongoDB } from '@src/core/domains/database/mongodb/interfaces/IMongoDB';
import { IEventService } from '@src/core/domains/events/interfaces/IEventService';
import IExpress from '@src/core/domains/express/interfaces/IExpress';
import IValidatorService from '@src/core/domains/validator/interfaces/IValidatorService';

export interface ICoreContainers {
    [key: string]: any;
    /**
     * Event Dispatcher Service
     * Provided by '@src/core/domains/events/providers/EventProvider'
     */
    events: IEventService;
    /**
     * Auth service
     * Provided by '@src/core/domains/auth/providers/AuthProvider'
     */
    auth: IAuthService;
    /**
     * MongoDB Service
     * Provided by '@src/core/domains/database/mongodb/providers/MongoDBProvider'
     */
    mongodb: IMongoDB;
    /**
     * Express web server Service
     * Provided by '@src/core/domains/express/providers/ExpressProvider'
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
    validate: IValidatorService;
}

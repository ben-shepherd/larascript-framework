import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import ICommandService from '@src/core/domains/console/interfaces/ICommandService';
import { IDatabaseService } from '@src/core/domains/database/interfaces/IDatabaseService';
import { IEventService } from '@src/core/domains/events/interfaces/IEventService';
import IExpressService from '@src/core/domains/express/interfaces/IExpress';
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
     * Database Service
     * Provided by '@src/core/domains/database/providers/DatabaseProvider'
     */
    db: IDatabaseService;

    /**
     * Express web server Service
     * Provided by '@src/core/domains/express/providers/ExpressProvider'
     */
    express: IExpressService;

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

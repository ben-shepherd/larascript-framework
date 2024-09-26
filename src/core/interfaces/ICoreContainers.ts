import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import ICommandService from '@src/core/domains/console/interfaces/ICommandService';
import { IDatabaseService } from '@src/core/domains/database/interfaces/IDatabaseService';
import { IEventService } from '@src/core/domains/events/interfaces/IEventService';
import { IRequestContext } from '@src/core/domains/express/interfaces/ICurrentRequest';
import IExpressService from '@src/core/domains/express/interfaces/IExpressService';
import IValidatorService from '@src/core/domains/validator/interfaces/IValidatorService';
import readline from 'node:readline';

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
     * Request Context service
     * Provided by '@src/core/domains/express/providers/ExpressProvider'
     */
    requestContext: IRequestContext;

    /**
     * Console service
     * Provided by '@src/core/domains/console/providers/ConsoleProvider'
     */
    console: ICommandService;

    /**
     * Readline interface
     * Provided by '@src/core/domains/console/providers/ConsoleProvider'
     */
    readline: readline.Interface;

    /**
     * Validator service
     * Provided by '@src/core/domains/validator/providers/ValidatorProvider'
     */
    validate: IValidatorService;
}

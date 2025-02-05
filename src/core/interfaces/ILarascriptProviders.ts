import ICommandService from '@src/core/domains/console/interfaces/ICommandService';
import { IDatabaseService } from '@src/core/domains/database/interfaces/IDatabaseService';
import { IEloquentQueryBuilderService } from '@src/core/domains/eloquent/interfaces/IEloquentQueryBuilderService';
import { IEventService } from '@src/core/domains/events/interfaces/IEventService';
import IHttpService from '@src/core/domains/http/interfaces/IHttpService';
import { IRequestContext } from '@src/core/domains/http/interfaces/IRequestContext';
import { ILoggerService } from '@src/core/domains/logger/interfaces/ILoggerService';
import IValidatorService from '@src/core/domains/validator/interfaces/IValidatorService';
import readline from 'node:readline';

import { IACLService } from '../domains/auth/interfaces/acl/IACLService';
import { IJwtAuthService } from '../domains/auth/interfaces/jwt/IJwtAuthService';
import { IAuthService } from '../domains/auth/interfaces/service/IAuthService';

export interface ILarascriptProviders {

    [key: string]: unknown;

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
     * JWT Auth service
     * Provided by '@src/core/domains/auth/providers/AuthProvider'
     */
    'auth.jwt': IJwtAuthService;

    /**
     * ACL service
     * Provided by '@src/core/domains/auth/providers/AuthProvider'
     */
    'auth.acl': IACLService;

    /**

     * Database Service
     * Provided by '@src/core/domains/database/providers/DatabaseProvider'
     */

    db: IDatabaseService;

    /**
     * Query Service
     * Provided by '@src/core/domains/eloquent/providers/EloquentQueryProvider'
     * Provides fluent interface for database queries using the Eloquent ORM pattern
     */
    query: IEloquentQueryBuilderService;

    /**
     * Express web server Service
     * Provided by '@src/core/domains/http/providers/HttpProvider'
     */
    http: IHttpService;


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

    /**
     * Logger service
     * Provided by '@src/core/domains/logger/providers/LoggerProvider'
     */
    logger: ILoggerService;
}

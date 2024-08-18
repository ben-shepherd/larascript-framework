import ApiToken from '@src/app/models/auth/ApiToken';
import User from '@src/app/models/auth/User';
import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import UserRepository from '@src/app/repositories/auth/UserRepository';
import CreateUserValidator from '@src/app/validators/user/CreateUserValidator';
import UpdateUserValidator from '@src/app/validators/user/UpdateUserValidator';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

const config: IAuthConfig = {
    models: {
        user: User,
        apiToken: ApiToken
    },
    repositories: {
        user: UserRepository,
        apiToken: ApiTokenRepository
    },
    validators: {
        createUser: CreateUserValidator,
        updateUser: UpdateUserValidator,
    },
    /**
     * Enable or disable auth routes
     */
    enableAuthRoutes: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES, 'true'),
    /**
     * Enable or disable create a new user endpoint
     */
    enableAuthRoutesAllowCreate: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;
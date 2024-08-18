import ApiToken from '@app/models/auth/ApiToken';
import User from '@app/models/auth/User';
import ApiTokenRepository from '@app/repositories/auth/ApiTokenRepository';
import UserRepository from '@app/repositories/auth/UserRepository';
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
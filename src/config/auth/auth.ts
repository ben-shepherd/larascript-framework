import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

const config: IAuthConfig = {
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
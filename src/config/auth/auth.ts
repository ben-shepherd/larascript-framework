import ApiTokenRepository from '../../app/repositories/ApiTokenRepository';
import UserRepository from '../../app/repositories/UserRepository';
import { AppAuthService } from '../../app/services/AppAuthService';
import { IAuthConfig } from '../../core/interfaces/IAuthConfig';
import parseBooleanFromString from '../../core/util/parseBooleanFromString';

const config: IAuthConfig = {
    /**
     * Expandable auth service class
     */
    authService: AppAuthService,
    /**
     * User repository for accessing user data
     */
    userRepository: UserRepository,
    /**
     * Api token repository for accessing api tokens
     */
    apiTokenRepository: ApiTokenRepository,
    /**
     * Enable or disable auth routes
     */
    authRoutes: parseBooleanFromString(process.env.AUTH_ROUTES, 'true'),
    /**
     * Enable or disable create a new user endpoint
     */
    authCreateAllowed: parseBooleanFromString(process.env.AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;
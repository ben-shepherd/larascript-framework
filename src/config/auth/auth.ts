import ApiToken from '@src/app/models/auth/ApiToken';
import User from '@src/app/models/auth/User';
import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import UserRepository from '@src/app/repositories/auth/UserRepository';
import { AppAuthService } from '@src/app/services/AppAuthService';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

/**
 * Provides type hinting across the application
 * Don't forget to update these properties to match what is provided to the config.
 */
export interface AuthConfigTypeHelpers {
    authService: AppAuthService,
    userModel: User,
    userRepository: UserRepository,
    apiTokenModel: ApiToken
    apiTokenRepository: ApiTokenRepository,
}

const config: IAuthConfig = {
    /**
     * Auth class that can be extended on or replaced
     */
    authService: AppAuthService,
    /**
     * User model
     */
    userModel: User,
    /**
     * User repository for accessing user data
     */
    userRepository: UserRepository,
    /**
     * Api Token model
     */
    apiTokenModel: ApiToken,
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
import User from '@src/app/models/auth/User';
import UserRepository from '@src/app/repositories/auth/UserRepository';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import BaseAuthService from '@src/core/domains/auth/services/BaseAuthService';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

/**
 * Provides type hinting across the application
 * Don't forget to update these properties to match what is provided to the config.
 */
export interface AuthConfigTypeHelpers {
    authService: BaseAuthService,
    userModel: User,
    userRepository: UserRepository
}

const config: IAuthConfig = {
    /**
     * Auth class that can be extended on or replaced
     */
    authService: BaseAuthService,
    /**
     * User model
     */
    userModel: User,
    /**
     * User repository for accessing user data
     */
    userRepository: UserRepository,
    /**
     * Enable or disable auth routes
     */
    authRoutes: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES, 'true'),
    /**
     * Enable or disable create a new user endpoint
     */
    authCreateAllowed: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;
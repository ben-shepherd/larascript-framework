import User from '@src/app/models/auth/User';
import CreateUserValidator from '@src/app/validators/user/CreateUserValidator';
import UpdateUserValidator from '@src/app/validators/user/UpdateUserValidator';
import { BaseAuthAdapterTypes } from '@src/core/domains/auth/interfaces/adapter/AuthAdapterTypes.t';
import ApiToken from '@src/core/domains/auth/models/ApiToken';
import AuthConfig from '@src/core/domains/auth/services/AuthConfig';
import JwtAuthService from '@src/core/domains/auth/services/JwtAuthService';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

/**
 * Auth Configuration Module
 * 
 * This module configures authentication adapters and settings for the application.
 * It defines available auth adapters (currently JWT) and their configurations.
 * 
 * Auth adapters, and related services can be retrieved in the application using:
 * 
 * ```ts
 * // Get auth service
 * const authService = app('auth')
 * const aclService = app('auth.acl')
 * const jwtAdapter = app('auth.jwt')
 * 
 * 
 * // Get specific adapter
 * app('auth').getAdapter('jwt')
 * ```
 * 
 */

// Type helper for auth adapters
export interface AuthAdapters extends BaseAuthAdapterTypes {
    default: JwtAuthService
    jwt: JwtAuthService
}

// Define auth configs
export const authConfig = AuthConfig.define([

    // Default JWT Authentication
    AuthConfig.config(JwtAuthService, {
        name: 'jwt',
        models: {
            user: User,
            apiToken: ApiToken
        },
        validators: {
            createUser: CreateUserValidator,
            updateUser: UpdateUserValidator
        },

        routes: {
            enableAuthRoutes: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES, 'true'),
            enableAuthRoutesAllowCreate: parseBooleanFromString(process.env.ENABLE_AUTH_ROUTES_ALLOW_CREATE, 'true'),
        },
        settings: {
            secret: process.env.JWT_SECRET as string ?? '',
            expiresInMinutes: process.env.JWT_EXPIRES_IN_MINUTES ? parseInt(process.env.JWT_EXPIRES_IN_MINUTES) : 60,
        }
    })

    // Define more auth adapters here
])


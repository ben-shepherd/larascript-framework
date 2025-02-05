import User from '@src/app/models/auth/User';
import CreateUserValidator from '@src/app/validators/user/CreateUserValidator';
import UpdateUserValidator from '@src/app/validators/user/UpdateUserValidator';
import { BaseAuthAdapterTypes } from '@src/core/domains/auth/interfaces/adapter/AuthAdapterTypes.t';
import AuthConfig from '@src/core/domains/auth/services/AuthConfig';
import JwtAuthService from '@src/core/domains/auth/services/JwtAuthService';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';


// Type helper for auth adapters
export interface AuthAdapters extends BaseAuthAdapterTypes {
    default: JwtAuthService
}

// Define auth configs
export const authConfig = AuthConfig.define([

    // JWT Authentication
    AuthConfig.config(JwtAuthService, {
        name: 'default',
        models: {
            user: User
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
    // Define more auth configs here
])


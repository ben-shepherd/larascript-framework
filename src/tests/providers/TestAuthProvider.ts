import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import AuthConfig from "@src/core/domains/auth/services/AuthConfig";
import JwtAuthService from "@src/core/domains/auth/services/JwtAuthService";
import parseBooleanFromString from "@src/core/util/parseBooleanFromString";
import TestApiTokenModel from "@src/tests/models/models/TestApiTokenModel";
import TestUser from "@src/tests/models/models/TestUser";
import TestCreateUserValidator from "@src/tests/validator-legacy/TestCreateUserValidator";
import TestUpdateUserValidator from "@src/tests/validator-legacy/TestUpdateUserValidator";

export default class TestAuthProvider extends AuthProvider {

    protected config = AuthConfig.define([
        AuthConfig.config(JwtAuthService, {
            name: 'jwt',
            models: {
                user: TestUser,
                apiToken: TestApiTokenModel
            },
            validators: {
                createUser: TestCreateUserValidator,
                updateUser: TestUpdateUserValidator
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
    ])

}

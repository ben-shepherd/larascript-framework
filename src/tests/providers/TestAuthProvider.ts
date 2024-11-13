import authConfig from "@src/config/auth";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import AuthService from "@src/core/domains/auth/services/AuthService";
import TestApiTokenFactory from "@src/tests/factory/TestApiTokenFactory";
import TestUserFactory from "@src/tests/factory/TestUserFactory";
import TestApiTokenModel from "@src/tests/models/models/TestApiTokenModel";
import TestUser from "@src/tests/models/models/TestUser";
import TestApiTokenRepository from "@src/tests/repositories/TestApiTokenRepository";
import TestUserRepository from "@src/tests/repositories/TestUserRepository";
import TestCreateUserValidator from "@src/tests/validator/TestCreateUserValidator";
import TestUpdateUserValidator from "@src/tests/validator/TestUpdateUserValidator";

export default class TestAuthProvider extends AuthProvider {

    protected config: IAuthConfig = {
        ...authConfig,
        service: {
            authService: AuthService
        },
        models: {
            user: TestUser,
            apiToken: TestApiTokenModel
        },
        repositories: {
            user: TestUserRepository,
            apiToken: TestApiTokenRepository
        },
        factory: {
            userFactory: TestUserFactory,
            apiTokenFactory: TestApiTokenFactory
        },
        validators: {
            createUser: TestCreateUserValidator,
            updateUser: TestUpdateUserValidator,
        },
    }

}

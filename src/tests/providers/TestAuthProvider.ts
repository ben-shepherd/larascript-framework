import authConfig from "@src/config/auth";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import AuthProvider from "@src/core/domains/auth/providers/AuthProvider";
import AuthService from "@src/core/domains/auth/services/AuthService";

import TestApiTokenFactory from "../factory/TestApiTokenFactory";
import TestUserFactory from "../factory/TestUserFactory";
import TestApiTokenModel from "../models/models/TestApiTokenModel";
import TestUser from "../models/models/TestUser";
import TestApiTokenRepository from "../repositories/TestApiTokenRepository";
import TestUserRepository from "../repositories/TestUserRepository";
import TestCreateUserValidator from "../validator/TestCreateUserValidator";
import TestUpdateUserValidator from "../validator/TestUpdateUserValidator";

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

import { IApiTokenFactory } from "@src/core/domains/auth/interfaces/IApiTokenFactory";
import IApiTokenModel from "@src/core/domains/auth/interfaces/IApitokenModel";
import IApiTokenRepository from "@src/core/domains/auth/interfaces/IApiTokenRepository";
import { IJwtAuthService } from "@src/core/domains/auth/interfaces/IAuthService";
import { IPermissionsConfig } from "@src/core/domains/auth/interfaces/IPermissionsConfig";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import IUserRepository from "@src/core/domains/auth/interfaces/IUserRepository";
import { ValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";
import { ICtor } from "@src/core/interfaces/ICtor";
import IFactory from "@src/core/interfaces/IFactory";
import { ModelConstructor } from "@src/core/interfaces/IModel";
import { RepositoryConstructor } from "@src/core/interfaces/IRepository";
import { ServiceConstructor } from "@src/core/interfaces/IService";

export interface IJwtAuthConfig {
    service: {
        authService: ServiceConstructor<IJwtAuthService>;
    };
    models: {
        user: ModelConstructor<IUserModel>;
        apiToken: ModelConstructor<IApiTokenModel>;
    };
    repositories: {
        user: RepositoryConstructor<IUserModel, IUserRepository>;
        apiToken: RepositoryConstructor<IApiTokenModel, IApiTokenRepository>;
    };
    factory: {
        userFactory: ICtor<IFactory>;
        apiTokenFactory: ICtor<IApiTokenFactory>;
    }
    validators: {
        createUser: ValidatorConstructor;
        updateUser: ValidatorConstructor;
    };
    jwtSecret: string,
    expiresInMinutes: number;
    enableAuthRoutes: boolean;
    enableAuthRoutesAllowCreate: boolean;
    permissions: IPermissionsConfig;
}
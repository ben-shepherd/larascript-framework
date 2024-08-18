import { ModelConstructor } from "@src/core/interfaces/IModel";
import { RepositoryConstructor } from "@src/core/interfaces/IRepository";
import IApiTokenModel from "./IApitokenModel";
import IApiTokenRepository from "./IApiTokenRepository";
import IUserModel from "./IUserModel";
import IUserRepository from "./IUserRepository";

export interface IAuthConfig {
    models: {
        user: ModelConstructor<IUserModel>;
        apiToken: ModelConstructor<IApiTokenModel>;
    },
    repositories: {
        user: RepositoryConstructor<IUserModel, IUserRepository>;
        apiToken: RepositoryConstructor<IApiTokenModel, IApiTokenRepository>;
    }
    enableAuthRoutes: boolean;
    enableAuthRoutesAllowCreate: boolean;
}
import { AuthConfigTypeHelpers } from "@src/config/auth/auth";
import { ModelConstructor } from "@src/core/interfaces/IModel";
import { RepositoryConstructor } from "@src/core/interfaces/IRepository";
import { ServiceConstructor } from "@src/core/interfaces/IService";

export interface IAuthConfig {
    authService: ServiceConstructor<AuthConfigTypeHelpers['authService']>;
    userModel: ModelConstructor<AuthConfigTypeHelpers['userModel']>;
    userRepository: RepositoryConstructor<AuthConfigTypeHelpers['userModel'], AuthConfigTypeHelpers['userRepository']>;
    apiTokenModel: ModelConstructor<AuthConfigTypeHelpers['apiTokenModel']>,
    apiTokenRepository: RepositoryConstructor<AuthConfigTypeHelpers['apiTokenModel'], AuthConfigTypeHelpers['apiTokenRepository']>;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}
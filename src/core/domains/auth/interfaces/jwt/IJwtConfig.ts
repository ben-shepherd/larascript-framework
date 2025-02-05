import { AuthAdapterConstructor } from "@src/core/domains/auth/interfaces/adapter/IAuthAdapter";
import { IBaseAuthConfig } from "@src/core/domains/auth/interfaces/config/IAuth";
import { UserConstructor } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { ValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";
import { ApiTokenConstructor } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";

export interface IJwtConfig extends IBaseAuthConfig {
    name: string;
    adapter: AuthAdapterConstructor
    models?: {
        user?: UserConstructor;
        apiToken?: ApiTokenConstructor;
    }
    validators: {
        createUser: ValidatorConstructor;
        updateUser: ValidatorConstructor;
    };
    settings: {
        secret: string,
        expiresInMinutes: number;
    },
    routes: {
        enableAuthRoutes: boolean;
        enableAuthRoutesAllowCreate: boolean;
    }
}

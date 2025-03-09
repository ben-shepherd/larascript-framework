import { AuthAdapterConstructor } from "@src/core/domains/auth/interfaces/adapter/IAuthAdapter";
import { IBaseAuthConfig } from "@src/core/domains/auth/interfaces/config/IAuth";
import { ApiTokenConstructor } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";
import { UserConstructor } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { CustomValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";

export interface IJwtConfig extends IBaseAuthConfig {
    name: string;
    adapter: AuthAdapterConstructor
    models?: {
        user?: UserConstructor;
        apiToken?: ApiTokenConstructor;
    }
    validators?: {
        createUser?: CustomValidatorConstructor;
        updateUser?: CustomValidatorConstructor;
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

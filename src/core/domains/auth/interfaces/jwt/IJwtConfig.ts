import { ValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";
import { AuthAdapterConstructor } from "@src/core/domains/auth/interfaces/adapter/IAuthAdapter";
import { IBaseAuthConfig } from "@src/core/domains/auth/interfaces/config/IAuth";
import { UserConstructor } from "@src/core/domains/auth/interfaces/models/IUserModel";

export interface IJwtConfig extends IBaseAuthConfig {
    name: string;
    adapter: AuthAdapterConstructor
    models: {
        user: UserConstructor;
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

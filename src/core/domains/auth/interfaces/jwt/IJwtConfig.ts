import { ValidatorConstructor } from "@src/core/domains/validator/interfaces/IValidator";

import { AuthAdapterConstructor } from "../adapter/IAuthAdapter";
import { IBaseAuthConfig } from "../config/IAuth";
import { UserConstructor } from "../models/IUserModel";

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

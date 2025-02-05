import { BaseAdapterTypes } from "@src/core/base/BaseAdapter";
import { IJwtAuthService } from "@src/core/domains/auth/interfaces/jwt/IJwtAuthService";
import { IAuthAdapter } from "@src/core/domains/auth/interfaces/adapter/IAuthAdapter";

export type BaseAuthAdapterTypes =  BaseAdapterTypes<IAuthAdapter> & {
    default: IJwtAuthService
}
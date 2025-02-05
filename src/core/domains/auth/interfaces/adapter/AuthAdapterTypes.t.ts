import { BaseAdapterTypes } from "@src/core/base/BaseAdapter";

import { IJwtAuthService } from "../jwt/IJwtAuthService";
import { IAuthAdapter } from "./IAuthAdapter";

export type BaseAuthAdapterTypes =  BaseAdapterTypes<IAuthAdapter> & {
    default: IJwtAuthService
}
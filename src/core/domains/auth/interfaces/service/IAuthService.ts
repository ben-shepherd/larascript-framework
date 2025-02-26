 
import { AuthAdapters } from "@src/config/auth.config";
import { IACLService } from "@src/core/domains/auth/interfaces/acl/IACLService";

import { IUserModel } from "../models/IUserModel";

export interface IAuthService {
    acl(): IACLService;
    boot(): Promise<void>
    getDefaultAdapter(): AuthAdapters['default']
    getJwtAdapter(): AuthAdapters['jwt']
    check(): Promise<boolean>
    user(): Promise<IUserModel | null>
}

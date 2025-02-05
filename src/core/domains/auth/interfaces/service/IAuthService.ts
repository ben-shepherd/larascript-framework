 
import { AuthAdapters } from "@src/config/auth";

import { IACLService } from "../acl/IACLService";

export interface IAuthService {
    acl(): IACLService;
    boot(): Promise<void>
    getDefaultAdapter(): AuthAdapters['default']
    getJwtAdapter(): AuthAdapters['jwt']
}

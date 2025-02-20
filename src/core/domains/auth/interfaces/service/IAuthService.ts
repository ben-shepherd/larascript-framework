 
import { AuthAdapters } from "@src/config/auth.config";
import { IACLService } from "@src/core/domains/auth/interfaces/acl/IACLService";

export interface IAuthService {
    acl(): IACLService;
    boot(): Promise<void>
    getDefaultAdapter(): AuthAdapters['default']
    getJwtAdapter(): AuthAdapters['jwt']
}

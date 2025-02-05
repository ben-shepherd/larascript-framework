 
import { AuthAdapters } from "@src/config/auth";

import { IACLService } from "../acl/IACLService";
import { IUserRepository } from "../repository/IUserRepository";

export interface IAuthService {
    acl(): IACLService;
    boot(): Promise<void>
    getDefaultAdapter(): AuthAdapters['default']
    getJwtAdapter(): AuthAdapters['jwt']
    getUserRepository(): IUserRepository;
}

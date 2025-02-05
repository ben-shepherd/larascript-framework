 
import { IACLService } from "../acl/IACLService";
import { IJwtAuthService } from "../jwt/IJwtAuthService";

export interface IAuthService {
    boot(): Promise<void>
    getDefaultAdapter(): IJwtAuthService
    acl(): IACLService;
}

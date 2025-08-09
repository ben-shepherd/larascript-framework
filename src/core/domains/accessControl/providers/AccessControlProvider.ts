import { BaseProvider } from "@ben-shepherd/larascript-core-bundle";
import { aclConfig } from "@src/config/acl.config";
import BasicACLService from "@src/core/domains/accessControl/services/BasicACLService";
import { IAclConfig } from "@src/core/domains/auth/interfaces/acl/IAclConfig";

class AccessControlProvider extends BaseProvider {

    config: IAclConfig = aclConfig

    async register(): Promise<void> {
        this.bind('acl.basic', new BasicACLService(this.config));
    }

}

export default AccessControlProvider;

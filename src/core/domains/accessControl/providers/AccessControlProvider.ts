import { aclConfig } from "@src/config/acl.config";
import BaseProvider from "@src/core/base/Provider";
import { IAclConfig } from "@src/core/domains/auth/interfaces/acl/IAclConfig";
import BasicACLService from "@src/core/domains/accessControl/services/BasicACLService";

class AccessControlProvider extends BaseProvider {

    config: IAclConfig = aclConfig

    async register(): Promise<void> {
        this.bind('acl.basic', new BasicACLService(this.config));
    }

}

export default AccessControlProvider;

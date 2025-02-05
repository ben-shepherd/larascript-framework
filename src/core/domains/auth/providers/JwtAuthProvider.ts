import { aclConfig } from "@src/config/acl";
import { authConfig } from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";

import Auth, { auth } from "../services/AuthService";

class AuthProvider extends BaseProvider{

    async register() {
        this.bind('auth', new Auth(authConfig, aclConfig))
    }

    async boot() {
        auth().boot();
    }


}



import { aclConfig } from "@src/config/acl";
import { authConfig } from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";

import Auth from "../services/AuthService";

class AuthProvider extends BaseProvider{

    async register() {
        this.bind('auth', new Auth(authConfig, aclConfig))
        this.bind('auth.jwt', (() => app('auth').getDefaultAdapter())())
    }

    async boot() {
        app('auth').boot();
    }

}

export default AuthProvider;



import { aclConfig } from "@src/config/acl";
import { authConfig } from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";

import Auth from "../services/AuthService";

class AuthProvider extends BaseProvider{

    async register() {
        const authService = new Auth(authConfig, aclConfig);
        await authService.boot();
        
        this.bind('auth', authService);
        this.bind('auth.jwt', (() => authService.getDefaultAdapter())())
    }

}

export default AuthProvider;



import { aclConfig } from "@src/config/acl";
import { authConfig } from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";
import { app } from "@src/core/services/App";
import GenerateJwtSecret from "@src/core/domains/auth/commands/GenerateJwtSecret";
import Auth from "@src/core/domains/auth/services/AuthService";

class AuthProvider extends BaseProvider{

    async register() {
        const authService = new Auth(authConfig, aclConfig);
        await authService.boot();
        
        // Bind services
        this.bind('auth', authService);
        this.bind('auth.jwt', (() => authService.getDefaultAdapter())())
        this.bind('auth.acl', (() => authService.acl())())

        // Register commands
        app('console').register().register(GenerateJwtSecret)
    }


}

export default AuthProvider;




import { aclConfig } from "@src/config/acl";
import { authConfig } from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";
import GenerateJwtSecret from "@src/core/domains/auth/commands/GenerateJwtSecret";
import Auth from "@src/core/domains/auth/services/AuthService";
import { app } from "@src/core/services/App";

class AuthProvider extends BaseProvider{

    protected config = authConfig

    protected aclConfig = aclConfig

    async register() {
        const authService = new Auth(this.config, this.aclConfig);
        await authService.boot();
        
        // Bind services
        this.bind('auth', authService);
        this.bind('auth.jwt', (() => authService.getDefaultAdapter())())
        this.bind('auth.acl', (() => authService.acl())())

        // Register commands
        app('console').register(GenerateJwtSecret)
    }


}

export default AuthProvider;


import authConfig from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";
import GenerateJwtSecret from "@src/core/domains/auth/commands/GenerateJWTSecret";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import { App } from "@src/core/services/App";

export default class AuthProvider extends BaseProvider {

    /**
     * The configuration for the auth service
     */
    protected config: IAuthConfig = authConfig;

    /**
     * Register method
     *
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     *
     * @returns Promise<void>
     */
    public async register(): Promise<void> {

        this.log('Registering AuthProvider');

        /**
         * Setup the registed authService
         */
        const authServiceCtor = this.config.service.authService;
        const authService = new authServiceCtor(this.config);

        /**
         * Setup the container
         */
        App.setContainer('auth', authService);

        /**
         * Register internal commands
         */
        App.container('console').register().registerAll([
            GenerateJwtSecret
        ])
    }

    public async boot(): Promise<void> {}

}

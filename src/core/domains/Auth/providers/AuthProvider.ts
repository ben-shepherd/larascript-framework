import authConfig from "@src/config/auth";
import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";

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
    }

    public async boot(): Promise<void> {}
}

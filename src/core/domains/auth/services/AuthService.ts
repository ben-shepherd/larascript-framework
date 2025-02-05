import { AuthAdapters } from "@src/config/auth";
import BaseAdapter from "@src/core/base/BaseAdapter";
import { app } from "@src/core/services/App";

import { IACLService } from "../interfaces/acl/IACLService";
import { IAclConfig } from "../interfaces/acl/IAclConfig";
import { IBaseAuthConfig } from "../interfaces/config/IAuth";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import { IAuthService } from "../interfaces/service/IAuthService";
import UserRepository from "../repository/UserRepository";
import ACLService from "./ACLService";

/**
 * Short hand for app('auth')
 */
export const auth = () => app('auth');

/**
 * Short hand for app('auth.acl')
 */
export const acl = () => app('auth.acl');


/**
 * Auth is the main service class that manages authentication adapters in the application.
 * It extends BaseAdapter to provide adapter management functionality and implements IAuthService.
 * 
 * This class:
 * - Manages multiple authentication strategies (JWT, OAuth, etc.) through adapters
 * - Provides a centralized way to configure and access auth functionality
 * - Handles booting and initialization of auth adapters
 * - Exposes a default adapter for common auth operations
 * 
 * The service is typically instantiated by AuthProvider and accessed via the 'auth' helper:
 * ```ts
 * // Access auth service
 * const authService = auth();
 * 
 * // Use default adapter
 * const token = await authService.getDefaultAdapter().attemptCredentials(email, password);
 * ```
 */
class Auth extends BaseAdapter<AuthAdapters> implements IAuthService {

    private config!: IBaseAuthConfig[];

    private aclService!: IACLService;

    constructor(config: IBaseAuthConfig[], aclConfig: IAclConfig) {
        super();
        this.config = config;
        this.aclService = new ACLService(aclConfig);
    }

    /**
     * Get the default adapter
     * @returns The default adapter
     */
    public getDefaultAdapter(): AuthAdapters['default'] {
        return this.getAdapter('default') as AuthAdapters['default'];
    }

    /**
     * Get the JWT adapter
     * @returns The JWT adapter
     */
    public getJwtAdapter(): AuthAdapters['jwt'] {
        return this.getAdapter('jwt') as AuthAdapters['jwt'];
    }

    /**
     * Boots the auth service
     * @returns A promise that resolves when the auth service is booted
     */
    public async boot(): Promise<void> {
        await this.registerAdapters();
        await this.bootAdapters();
    }

    /**
     * Registers the adapters
     */
    protected registerAdapters(): void {
        const aclConfig = this.aclService.getConfig();

        for(const adapter of this.config) {
            const adapterInstance = new adapter.adapter(adapter, aclConfig);
            this.addAdapterOnce(adapter.name, adapterInstance);
        }

    }

    /**
     * Boots the adapters
     */
    protected async bootAdapters(): Promise<void> {
        for(const adapterInstance of Object.values(this.adapters)) {
            await adapterInstance.boot();
        }
    }

    /**
     * Get the ACL service
     * @returns The ACL service
     */
    public acl(): IACLService {
        return this.aclService;
    }

    /**
     * Get the user repository
     * @returns The user repository
     */
    public getUserRepository(): IUserRepository {
        return new UserRepository();
    }

}

export default Auth;
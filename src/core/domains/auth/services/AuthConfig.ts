
import { AuthAdapterConstructor, IAuthAdapter } from "../interfaces/adapter/IAuthAdapter";
import { IBaseAuthConfig } from "../interfaces/config/IAuth";

/**
 * AuthConfig is a configuration service for managing authentication adapters.
 * It provides a centralized way to define and configure different authentication
 * strategies (like JWT, OAuth, etc.) through a consistent interface.
 * 
 * The class offers static helper methods to:
 * - Define multiple auth configurations using the `define()` method
 * - Create individual adapter configs using the `config()` method with type safety
 * 
 * Example usage:
 * ```ts
 * const authConfig = AuthConfig.define([
 *   AuthConfig.config(JwtAuthAdapter, {
 *     name: 'jwt',
 *     settings: {
 *       secret: 'xxx',
 *       expiresIn: 60
 *     }
 *   })
 * ]);
 * ```
 */
class AuthConfig {

    /**
     * Define a new auth config
     * @param config - The config for the adapter
     * @returns The adapter config
     */

    public static define(config: IBaseAuthConfig[]): IBaseAuthConfig[] {
        return config
    }

    /**
     * Create a new auth adapter config
     * @param adapter - The auth adapter constructor
     * @param config - The config for the adapter
     * @returns The adapter config
     */
    public static config<Adapter extends IAuthAdapter>(adapter: AuthAdapterConstructor<Adapter>, config: Omit<Adapter['config'], 'adapter'>): Adapter['config'] {
        return {
            adapter: adapter,
            ...config
        }  as unknown as Adapter['config'];
    }


}

export default AuthConfig;
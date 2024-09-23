import Singleton from "@src/core/base/Singleton";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";

// eslint-disable-next-line no-unused-vars
export type SecurityCallback = (...args: any[]) => boolean;

/**
 * An interface for defining security callbacks with an identifier.
 */
export type IdentifiableSecurityCallback = {
    // The identifier for the security callback.
    id: string;
    // The condition for when the security check should be executed. Defaults to 'always'.
    when: string | null;
    // The arguments for the security callback.
    arguements?: Record<string, unknown>;
    // The security callback function.
    callback: SecurityCallback;
}

/**
 * A list of security identifiers.
 */
export const SecurityIdentifiers = {
    RESOURCE_OWNER: 'resourceOwner',
    HAS_ROLE: 'hasRole',
    CUSTOM: 'custom'
} as const;

/**
 * Security class with static methods for basic defining security callbacks.
 */
class Security extends Singleton {

    /**
     * The condition for when the security check should be executed.
     */
    public when: string = 'always';

    /**
     * Sets the condition for when the security check should be executed.
     *
     * @param condition - The condition value. If the value is 'always', the security check is always executed.
     * @returns The Security class instance for chaining.
     */
    public static when(condition: string): typeof Security {
        this.getInstance().when = condition;
        return this;
    }

    /**
     * Gets and then resets the condition for when the security check should be executed to always.
     * @returns The when condition
     */
    public static getWhenAndReset(): string {
        const when = this.getInstance().when;
        this.getInstance().when = 'always';
        return when;
    }
    
    /**
     * Checks if the currently logged in user is the owner of the given resource.
     *
     * @param attribute - The key of the resource attribute that should contain the user id.
     * @returns A security callback that can be used in the security definition.
     */
    public static resourceOwner(attribute: string = 'userId'): IdentifiableSecurityCallback {
        return {
            id: SecurityIdentifiers.RESOURCE_OWNER,
            when: Security.getWhenAndReset(),
            arguements: { key: attribute },
            callback: (resource: IModel) => {
                if(typeof resource.getAttribute !== 'function') {
                    throw new Error('Resource is not an instance of IModel');
                }

                return resource.getAttribute(attribute) === App.container('auth').user()?.getId()
            }
        }
    }

    /**
     * Checks if the currently logged in user has the given role.
     * @param role The role to check.
     * @returns A callback function to be used in the security definition.
     */
    public static hasRole(roles: string | string[]): IdentifiableSecurityCallback {
        return {
            id: SecurityIdentifiers.HAS_ROLE,
            when: Security.getWhenAndReset(),
            callback: () => {
                const user = App.container('auth').user();
                return user?.hasRole(roles) ?? false
            }
        }
    }

    /**
     * Creates a custom security callback.
     *
     * @param identifier - The identifier for the security callback.
     * @param callback - The callback to be executed to check the security.
     * @param rest - The arguments for the security callback.
     * @returns A callback function to be used in the security definition.
     */
    public static custom(identifier: string, callback: SecurityCallback, ...rest: any[]): IdentifiableSecurityCallback {
        return {
            id: identifier,
            when: Security.getWhenAndReset(),
            callback: () => {
                return callback(...rest)
            }
        }
    }

}

export default Security
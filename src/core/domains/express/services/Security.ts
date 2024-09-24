import Singleton from "@src/core/base/Singleton";
import { IIdentifiableSecurityCallback, SecurityCallback } from "@src/core/domains/express/interfaces/ISecurity";
import authorizedSecurity from "@src/core/domains/express/security/authorizedSecurity";
import hasRoleSecurity from "@src/core/domains/express/security/hasRoleSecurity";
import resourceOwnerSecurity from "@src/core/domains/express/security/resourceOwnerSecurity";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { IModel } from "@src/core/interfaces/IModel";

/**
 * A list of security identifiers.
 */
export const SecurityIdentifiers = {
    AUTHORIZATION: 'authorization',
    RESOURCE_OWNER: 'resourceOwner',
    HAS_ROLE: 'hasRole',
    CUSTOM: 'custom'
} as const;

/**
 * The default condition for when the security check should be executed.
 */
export const ALWAYS = 'always';

/**
 * Security class with static methods for basic defining security callbacks.
 */
class Security extends Singleton {

    /**
     * The condition for when the security check should be executed.
     */
    public when: string[] | null = null;

    /**
     * The condition for when the security check should never be executed.
     */
    public never: string[] | null = null;

    /**
     * Sets the condition for when the security check should be executed.
     *
     * @param condition - The condition value. If the value is 'always', the security check is always executed.
     * @returns The Security class instance for chaining.
     */
    public static when(condition: string | string[]): typeof Security {
        condition = typeof condition === 'string' ? [condition] : condition;
        this.getInstance().when = condition;
        return this;
    }

    /**
     * Sets the condition for when the security check should never be executed.
     *
     * @param condition - The condition value(s) to set. If the value is 'always', the security check is never executed.
     * @returns The Security class instance for chaining.
     */
    public static never(condition: string | string[]): typeof Security {
        condition = typeof condition === 'string' ? [condition] : condition;
        this.getInstance().never = condition;
        return this;
    }

    /**
     * Gets and then resets the condition for when the security check should be executed to always.
     * @returns The when condition
     */
    public static getWhenAndReset(): string[] | null {
        const when = this.getInstance().when;
        this.getInstance().when = null;
        return when;
    }
    
    /**
     * Gets and then resets the condition for when the security check should never be executed.
     * @returns The when condition
     */
    public static getNeverAndReset(): string[] | null {
        const never = this.getInstance().never;
        this.getInstance().never = null;
        return never;
    }
    
    /**
     * Checks if the currently logged in user is the owner of the given resource.
     *
     * @param attribute - The key of the resource attribute that should contain the user id.
     * @returns A security callback that can be used in the security definition.
     */
    public static resourceOwner(attribute: string = 'userId'): IIdentifiableSecurityCallback {
        return {
            id: SecurityIdentifiers.RESOURCE_OWNER,
            when: Security.getWhenAndReset(),
            never: Security.getNeverAndReset(),
            arguements: { key: attribute },
            callback: (req: BaseRequest, resource: IModel) => resourceOwnerSecurity(req, resource, attribute)
        }
    }

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * 
     * Authorization failure does not throw any exceptions, this method allows the middleware to pass regarldess of authentication failure.
     * This will allow the user to have full control over the unathenticated flow.
     * 
     * Example:
     *     const authorizationSecurity = SecurityReader.findFromRequest(req, SecurityIdentifiers.AUTHORIZATION, [ALWAYS]);
     *
     *     if(authorizationSecurity && !authorizationSecurity.callback(req)) {
     *         responseError(req, res, new UnauthorizedError(), 401)
     *         return;
     *     }
     *
     *     // Continue processing
     *
     * @returns A security callback that can be used in the security definition.
     */
    public static authorized(): IIdentifiableSecurityCallback {
        return {
            id: SecurityIdentifiers.AUTHORIZATION,
            when: Security.getWhenAndReset(),
            never: Security.getNeverAndReset(),
            arguements: {
                throwExceptionOnUnauthorized: false
            },
            callback: (req: BaseRequest) => authorizedSecurity(req)
        }
    }

    /**
     * Same as `authorization` but throws an exception if the user is not authenticated.
     * This method is useful if you want to handle authentication failure in a centralized way.
     * 
     * @returns A security callback that can be used in the security definition.
     */
    public static authorizationThrowsException(): IIdentifiableSecurityCallback {
        return {
            id: SecurityIdentifiers.AUTHORIZATION,
            when: Security.getWhenAndReset(),
            never: Security.getNeverAndReset(),
            arguements: {
                throwExceptionOnUnauthorized: true
            },
            callback: (req: BaseRequest) => authorizedSecurity(req)
        }
    }

    /**
     * Checks if the currently logged in user has the given role.
     * @param role The role to check.
     * @returns A callback function to be used in the security definition.
     */
    public static hasRole(roles: string | string[]): IIdentifiableSecurityCallback {
        return {
            id: SecurityIdentifiers.HAS_ROLE,
            when: Security.getWhenAndReset(),
            never: Security.getNeverAndReset(),
            callback: (req: BaseRequest) => hasRoleSecurity(req, roles)
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
    // eslint-disable-next-line no-unused-vars
    public static custom(identifier: string, callback: SecurityCallback, ...rest: any[]): IIdentifiableSecurityCallback {
        return {
            id: identifier,
            never: Security.getNeverAndReset(),
            when: Security.getWhenAndReset(),
            callback: (req: BaseRequest, ...rest: any[]) => {
                return callback(req, ...rest)
            }
        }
    }

}

export default Security
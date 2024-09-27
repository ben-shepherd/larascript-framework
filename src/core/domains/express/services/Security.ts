import Singleton from "@src/core/base/Singleton";
import { IIdentifiableSecurityCallback, SecurityCallback } from "@src/core/domains/express/interfaces/ISecurity";
import SecurityRules, { SecurityIdentifiers } from "@src/core/domains/express/services/SecurityRules";

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
    public getWhenAndReset(): string[] | null {
        const when = this.when;
        this.when = null;
        return when;
    }
    
    /**
     * Gets and then resets the condition for when the security check should never be executed.
     * @returns The when condition
     */
    public getNeverAndReset(): string[] | null {
        const never = this.never;
        this.never = null;
        return never;
    }
    
    /**
     * Checks if the currently logged in user is the owner of the given resource.
     * 
     * Usage with RouteResource:
     *  - CREATE - Adds the attribute to the resource model
     *  - UPDATE - Checks the authroized user is the owner of the resource
     *  - DELETE - Checks the authroized user is the owner of the resource
     *  - SHOW   - Only shows the resource if the authroized user is the owner of the resource
     *  - INDEX  - Filters the resources by the authroized user
     * 
     * Example usage within an Action/Controller:
     * 
     *     // Instance of a model (resource)
     *     const result =  await repository.findById(id) 
     * 
     *     // Check if resourceOwner is applicable
     *     const resourceOwnerSecurity = SecurityReader.findFromRouteResourceOptions(options, SecurityIdentifiers.RESOURCE_OWNER, ['SomeConditionValue']);
     *
     *     // The callback checks the attribute on the resource model matches the authorized user
     *     if(resourceOwnerSecurity && !resourceOwnerSecurity.callback(req, result)) {
     *         responseError(req, res, new ForbiddenResourceError(), 403)
     *         return;
     *     }
     *
     * @param attribute - The key of the resource attribute that should contain the user id.
     * @returns A security callback that can be used in the security definition.
     */
    public static resourceOwner(attribute: string = 'userId'): IIdentifiableSecurityCallback {
        return SecurityRules[SecurityIdentifiers.RESOURCE_OWNER](attribute);
    }

    /**
     * Enable scope security checks.
     * 
     * This will include scope security checks for all route resources.
     * 
     * @returns A security callback that can be used in the security definition.
     */
    public static enableScopes(): IIdentifiableSecurityCallback {
        return SecurityRules[SecurityIdentifiers.ENABLE_SCOPES]();
    }

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * 
     * Authorization failure does not throw any exceptions, this method allows the middleware to pass regarldess of authentication failure.
     * This will allow the user to have full control over the unathenticated flow.
     * 
     * Example usage within an Action/Controller:
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
        return SecurityRules[SecurityIdentifiers.AUTHORIZED]();
    }

    /**
     * Same as `authorization` but throws an exception if the user is not authenticated.
     * This method is useful if you want to handle authentication failure in a centralized way.
     * 
     * @returns A security callback that can be used in the security definition.
     */
    public static authorizationThrowsException(): IIdentifiableSecurityCallback {
        return SecurityRules[SecurityIdentifiers.AUTHORIZED_THROW_EXCEPTION]();
    }

    /**
     * Checks if the currently logged in user has the given role.
     * @param role The role to check.
     * @returns A callback function to be used in the security definition.
     */
    public static hasRole(roles: string | string[]): IIdentifiableSecurityCallback {
        return SecurityRules[SecurityIdentifiers.HAS_ROLE](roles);
    }

    /**
     * Creates a security callback to check if the currently IP address has not exceeded a given rate limit.
     * 
     * @param limit - The maximum number of requests the user can make per minute.* 
     * @returns A callback function to be used in the security definition.
     */
    public static rateLimited(limit: number, perMinuteAmount: number = 1): IIdentifiableSecurityCallback {
        return SecurityRules[SecurityIdentifiers.RATE_LIMITED](limit, perMinuteAmount);
    } 

    /**
     * Creates a custom security callback.
     *
     * @param identifier - The identifier for the security callback.
     * @param callback - The callback to be executed to check the security.
     * @param rest - The arguments for the security callback.
     * @returns A callback function to be used in the security definition.
     */
     
    public static custom(identifier: string, callback: SecurityCallback, ...rest: any[]): IIdentifiableSecurityCallback {
        return SecurityRules[SecurityIdentifiers.CUSTOM](identifier, callback, ...rest);
    }

}

export default Security
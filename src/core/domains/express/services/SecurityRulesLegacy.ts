import { IIdentifiableSecurityCallback, SecurityCallback } from "@src/core/domains/express/interfaces/ISecurity"
import authorizedSecurity from "@src/core/domains/express/rules/authorizedSecurity"
import hasRoleSecurity from "@src/core/domains/express/rules/hasRoleSecurity"
import hasScopeSecurity from "@src/core/domains/express/rules/hasScopeSecurity"
import rateLimitedSecurity from "@src/core/domains/express/rules/rateLimitedSecurity"
import resourceOwnerSecurity from "@src/core/domains/express/rules/resourceOwnerSecurity"
import SecurityLegacy from "@src/core/domains/express/services/SecurityLegacy"
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t"
import { IModel } from "@src/core/interfaces/IModel"

/**
 * Security rules
 */
export interface ISecurityRulesLegacy {
    // eslint-disable-next-line no-unused-vars
    [key: string]: (...args: any[]) => IIdentifiableSecurityCallback
}

/**
 * The list of security identifiers.
 */
export const SecurityIdentifiersLegacy = {
    AUTHORIZED: 'authorized',
    AUTHORIZED_THROW_EXCEPTION: 'authorizedThrowException',
    RESOURCE_OWNER: 'resourceOwner',
    HAS_ROLE: 'hasRole',
    HAS_SCOPE: 'hasScope',
    RATE_LIMITED: 'rateLimited',
    ENABLE_SCOPES: 'enableScopes',
    CUSTOM: 'custom'
} as const;

const SecurityRulesLegacy: ISecurityRulesLegacy = {

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * Does not throw exceptions on unauthorized requests.
     * @returns 
     */
    [SecurityIdentifiersLegacy.AUTHORIZED]: () => ({
        id: SecurityIdentifiersLegacy.AUTHORIZED,
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        arguements: {
            throwExceptionOnUnauthorized: true
        },
        callback: (req: BaseRequest) => authorizedSecurity(req)
    }),

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * Throws an exception on unauthorized requests.
     * @returns 
     */
    [SecurityIdentifiersLegacy.AUTHORIZED_THROW_EXCEPTION]: () => ({
        id: SecurityIdentifiersLegacy.AUTHORIZED_THROW_EXCEPTION,
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        arguements: {
            throwExceptionOnUnauthorized: true
        },
        callback: (req: BaseRequest) => authorizedSecurity(req)
    }),

    /**
     * Checks if the currently logged in user is the owner of the given resource.
     * @param attribute 
     * @returns 
     */
    [SecurityIdentifiersLegacy.RESOURCE_OWNER]: (attribute: string = 'userId') => ({
        id: SecurityIdentifiersLegacy.RESOURCE_OWNER,
        also: SecurityIdentifiersLegacy.AUTHORIZED,
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        arguements: { key: attribute },
        callback: (req: BaseRequest, resource: IModel) => resourceOwnerSecurity(req, resource, attribute)
    }),


    /**
     * Checks if the currently logged in user has the given role.
     * @param roles 
     * @returns 
     */
    [SecurityIdentifiersLegacy.HAS_ROLE]: (roles: string | string[]) => ({
        id: SecurityIdentifiersLegacy.HAS_ROLE,
        also: SecurityIdentifiersLegacy.AUTHORIZED,
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        callback: (req: BaseRequest) => hasRoleSecurity(req, roles)
    }),

    /**
     * Enable scopes on the resource
     * @returns 
     */
    [SecurityIdentifiersLegacy.ENABLE_SCOPES]: () => ({
        id: SecurityIdentifiersLegacy.ENABLE_SCOPES,
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        // eslint-disable-next-line no-unused-vars
        callback: (_req: BaseRequest, _resource: IModel) => true,
    }),

    /**
     * Checks if the currently logged in user has the given scope(s).
     * @param scopesExactMatch 
     * @returns 
     */
    [SecurityIdentifiersLegacy.HAS_SCOPE]: (scopesExactMatch: string | string[] = [], scopesPartialMatch: string | string[] = []) => ({
        id: SecurityIdentifiersLegacy.HAS_SCOPE,
        also: SecurityIdentifiersLegacy.AUTHORIZED,
        arguements: { scopesExactMatch, scopesPartialMatch },
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        callback: (req: BaseRequest) => hasScopeSecurity(req, scopesExactMatch, scopesPartialMatch)
    }),

    /**
     * Rate limited security
     * @param limit 
     * @returns 
     */
    [SecurityIdentifiersLegacy.RATE_LIMITED]: (limit: number, perMinuteAmount: number) => ({
        id: SecurityIdentifiersLegacy.RATE_LIMITED,
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        callback: (req: BaseRequest) => rateLimitedSecurity(req, limit, perMinuteAmount),
    }),

    /**
     * Custom security rule
     * @param callback 
     * @param rest 
     * @returns 
     */
    // eslint-disable-next-line no-unused-vars
    [SecurityIdentifiersLegacy.CUSTOM]: (identifier: string, callback: SecurityCallback, ...rest: any[]) => ({
        id: identifier,
        never: SecurityLegacy.getInstance().getNeverAndReset(),
        when: SecurityLegacy.getInstance().getWhenAndReset(),
        callback: (req: BaseRequest, ...rest: any[]) => {
            return callback(req, ...rest)
        }
    })
} as const

export default SecurityRulesLegacy
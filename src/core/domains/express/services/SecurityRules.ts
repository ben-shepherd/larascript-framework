
import AbstractSecurityRule from "@src/core/domains/express/abstract/AbstractSecurityRule";
import { TSecurityRuleConstructor } from "@src/core/domains/express/interfaces/ISecurity";
import ResourceOwnerRule from "@src/core/domains/express/security/rules/ResourceOwnerRule";

import HasRoleRule from "../security/rules/HasRoleRule";
import ResourceScopeRule from "../security/rules/ResourceScopeRule";
import ScopeRule from "../security/rules/ScopeRule";

class SecurityRules {

    /**
     * Creates a new security rule.
     * 
     * @param options The options for the security rule
     * @returns The security rule
     */
    public static create<Rule extends AbstractSecurityRule = AbstractSecurityRule>(ruleConstructor: TSecurityRuleConstructor<Rule>, options?: Rule['options']): Rule {
        return new ruleConstructor().setRuleOptions(options ?? {}) as Rule;
    }

    /**
     * Creates a new resource owner security rule.
     * 
     * @param attribute The attribute of the resource that contains the owner ID
     * @returns The resource owner security rule
     */
    public static resourceOwner(attribute: string = 'userId'): ResourceOwnerRule {
        return this.create(ResourceOwnerRule, { 
            attribute: attribute
        });
    }

    /**
     * Creates a new has role security rule.
     * 
     * @param roles The roles to check
     * @returns The has role security rule
     */
    public static hasRole(roles: string | string[]): HasRoleRule {
        return this.create(HasRoleRule, {
            roles: roles
        });
    }

    /**
     * Creates a new enable scopes security rule.
     * 
     * @param scopes The scopes to check
     * @returns The enable scopes security rule
     */
    public static scopes(scopes: string | string[], exactMatch: boolean = true): ScopeRule {
        return this.create(ScopeRule, {
            scopes: scopes,
            exactMatch: exactMatch
        });
    }

    /**
     * Creates a new resource scopes security rule.
     * 
     * @returns The resource scopes security rule
     */
    public static resourceScopes(): ResourceScopeRule {
        return this.create(ResourceScopeRule);
    }

}

export default SecurityRules;
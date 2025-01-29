
import AbstractSecurityRule from "@src/core/domains/express/abstract/AbstractSecurityRule";
import { TSecurityRuleConstructor } from "@src/core/domains/express/interfaces/ISecurity";
import ResourceOwnerRule from "@src/core/domains/express/security/rules/ResourceOwnerRule";

import HasRoleRule from "../security/rules/HasRoleRule";

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

}

export default SecurityRules;
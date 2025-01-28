import AbstractSecurityRule from "../abstract/AbstractSecurityRule";
import { TSecurityRuleConstructor } from "../interfaces/ISecurity";
import ResourceOwnerRule from "../security/rules/ResourceOwnerRule";

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

    /*
     * Creates a new resource owner security rule.
     * 
     * @param primaryKey The primary key of the resource
     * @returns The resource owner security rule
     */
    public static resourceOwner(primaryKey: string = 'userId'): ResourceOwnerRule {
        return this.create(ResourceOwnerRule, { primaryKey })
    }

}

export default SecurityRules;
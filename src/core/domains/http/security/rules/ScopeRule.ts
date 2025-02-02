import SecurityException from "@src/core/domains/express/exceptions/SecurityException";

import HttpContext from "../../context/HttpContext";
import { SecurityEnum } from "../../enums/SecurityEnum";
import AbstractSecurityRule from "../abstract/AbstractSecurityRule";

type TEnableScopeRuleOptions = {
    scopes: string | string[];
    exactMatch: boolean
}

class ScopeRule extends AbstractSecurityRule<TEnableScopeRuleOptions> {

    protected readonly id = SecurityEnum.ENABLE_SCOPES;

    public async execute(context: HttpContext): Promise<boolean> {
        const apiToken = context.getApiToken();

        if(!apiToken) {
            return false;
        }

        const scopes = this.getRuleOptions().scopes;

        if(!scopes) {
            throw new SecurityException('Scopes are required');
        }

        const scopesArr = Array.isArray(scopes) ? scopes : [scopes];

        if(scopesArr.length === 0) {
            throw new SecurityException('No scopes provided');
        }
        
        const exactMatch = this.getRuleOptions().exactMatch;

        return apiToken.hasScope(scopesArr, exactMatch);
    }

}

export default ScopeRule;
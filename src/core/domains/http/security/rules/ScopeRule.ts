import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { auth } from "@src/core/domains/auth/services/AuthService";
import SecurityException from "@src/core/domains/express/exceptions/SecurityException";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { SecurityEnum } from "@src/core/domains/http/enums/SecurityEnum";
import AbstractSecurityRule from "@src/core/domains/http/security/abstract/AbstractSecurityRule";

type TEnableScopeRuleOptions = {
    scopes: string | string[];
    exactMatch: boolean
}

class ScopeRule extends AbstractSecurityRule<TEnableScopeRuleOptions> {

    protected readonly id = SecurityEnum.ENABLE_SCOPES;
    
    protected conditionsNotSupported: boolean = true;

    public async execute(context: HttpContext): Promise<boolean> {

        if(!await auth().check()) {
            throw new UnauthorizedError();
        }

        const apiToken = context.getApiToken();

        if(!apiToken) {
            return false;
        }

        const scopes = this.getRuleOptions().scopes;

        console.log('[ScopeRule] scopes', scopes);

        if(!scopes) {
            throw new SecurityException('Scopes are required');
        }

        const scopesArr = Array.isArray(scopes) ? scopes : [scopes];

        if(scopesArr.length === 0) {
            throw new SecurityException('No scopes provided');
        }
        
        const exactMatch = this.getRuleOptions().exactMatch;

        console.log('[ScopeRule] check', apiToken.hasScope(scopesArr, exactMatch));

        return apiToken.hasScope(scopesArr, exactMatch);
    }

}

export default ScopeRule;
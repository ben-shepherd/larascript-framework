import AbstractSecurityRule from "@src/core/domains/express/abstract/AbstractSecurityRule";
import HttpContext from "@src/core/domains/express/data/HttpContext";
import { SecurityEnum } from "@src/core/domains/express/enums/SecurityEnum";
import SecurityException from "@src/core/domains/express/exceptions/SecurityException";

class ResourceScopeRule extends AbstractSecurityRule {

    protected readonly id = SecurityEnum.ENABLE_SCOPES;

    public async execute(context: HttpContext): Promise<boolean> {
        const apiToken = context.getApiToken();

        if(!apiToken) {
            return false;
        }

        const routeItem = context.getRouteItem();

        if(!routeItem) {
            throw new SecurityException('Route item is required');
        }

        const resourceScopes = routeItem.resource?.scopes;

        if(!resourceScopes) {
            throw new SecurityException('Scopes are required');
        }

        const resourceScopesArr = Array.isArray(resourceScopes) ? resourceScopes : [resourceScopes];

        if(resourceScopesArr.length === 0) {
            throw new SecurityException('No scopes provided');
        }
        
        if(!apiToken.hasScope(resourceScopesArr, true)) {
            return false
        }

        return apiToken.hasScope(resourceScopesArr);
    }

}

export default ResourceScopeRule;
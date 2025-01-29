import Middleware from "@src/core/domains/express/base/Middleware";
import HttpContext from "@src/core/domains/express/data/HttpContext";

import ForbiddenResourceError from "../../auth/exceptions/ForbiddenResourceError";
import { SecurityEnum } from "../enums/SecurityEnum";
import SecurityException from "../exceptions/SecurityException";
import responseError from "../requests/responseError";
import SecurityReader from "../services/SecurityReader";

class SecurityMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {

        /**
         * Adds security rules to the Express Request
         * This is used below to find the defined security rules
         */
        this.bindSecurityToRequest(context);

        // /**
        //  * Check if the rate limit has been exceeded
        //  */
        // if(await applyRateLimitSecurity(req, res) === null) {
        //     return;
        // }
        
        // /**
        //  * Authorizes the user
        //  * Depending on option 'throwExceptionOnUnauthorized', can allow continue processing on failed auth
        //  */
        // if (await applyAuthorizeSecurity(route, req, res) === null) {
        //     return;
        // }
        
        /**
         * Check if the authorized user passes the has role security
         */
        if (await this.applyHasRoleSecurity(context) === null) {
            return;
        }
        
        // /**
        //  * Check if the authorized user passes the has scope security
        //  */
        // if (applyHasScopeSecurity(req, res) === null) {
        //     return;
        // }
                
        this.next();
    }

    /**
     * Binds the security rules to the Express Request
     * @param context The HttpContext
     */
    protected bindSecurityToRequest(context: HttpContext): void {
        const routeOptions = context.getRouteItem()
        const security = routeOptions?.security ?? []
        context.getRequest().security = security;
    }

    /**
     * Applies the has role security
     * @param context The HttpContext
     * @returns void | null
     */
    protected async applyHasRoleSecurity(context: HttpContext): Promise<void | null> {
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new SecurityException('Route options not found');
        }

        // Check if the hasRole security has been defined and validate
        const securityHasRole = SecurityReader.find(routeOptions, SecurityEnum.HAS_ROLE);
 
        if (securityHasRole && !(await securityHasRole.execute(context))) {
            responseError(context.getRequest(), context.getResponse(), new ForbiddenResourceError(), 403)
            return null;
        }
    
    }

}

export default SecurityMiddleware;
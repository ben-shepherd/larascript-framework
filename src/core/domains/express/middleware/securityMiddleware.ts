import Middleware from "../base/Middleware";
import HttpContext from "../data/HttpContext";

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
        
        // /**
        //  * Check if the authorized user passes the has role security
        //  */
        // if (applyHasRoleSecurity(req, res) === null) {
        //     return;
        // }
        
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

}

export default SecurityMiddleware;
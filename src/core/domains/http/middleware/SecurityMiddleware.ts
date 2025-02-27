import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import RateLimitedExceededError from "@src/core/domains/auth/exceptions/RateLimitedExceededError";
import SecurityException from "@src/core/domains/express/exceptions/SecurityException";
import Middleware from "@src/core/domains/http/base/Middleware";
import HttpContext from "@src/core/domains/http/context/HttpContext";
import { SecurityEnum } from "@src/core/domains/http/enums/SecurityEnum";
import responseError from "@src/core/domains/http/handlers/responseError";
import SecurityReader from "@src/core/domains/http/security/services/SecurityReader";

/**
 * SecurityMiddleware handles security rule validation for HTTP routes.
 * 
 * This middleware evaluates security rules defined on routes to enforce access control.
 * It supports multiple types of security checks including:
 * - Rate limiting
 * - Role-based access control
 * - Scope-based permissions
 * - Resource ownership validation
 * 
 * Example usage in route definition:
 * ```typescript
 * router.post('/posts', [PostController, 'create'], {
 *   // Require admin role and limit to 100 requests per minute
 *   security: [
 *     router.security().hasRole('admin'),
 *     router.security().rateLimited(100, 1)
 *   ]
 * });
 * 
 * // Resource routes with owner check
 * router.resource({
 *   prefix: '/posts',
 *   resource: PostModel,
 *   security: [
 *     router.security().resourceOwner('userId'),
 *     router.security().scopes(['posts.write'])
 *   ]
 * });
 * ```
 * 
 * The middleware:
 * 1. Binds security rules to the request
 * 2. Checks rate limiting rules
 * 3. Validates role-based access
 * 4. Validates scope-based permissions
 * 
 * If any security check fails, the request is rejected with an appropriate error response.
 */
class SecurityMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {

        /**
         * Adds security rules to the Express Request
         * This is used below to find the defined security rules
         */
        this.bindSecurityToRequest(context);

        /**
         * Check if the rate limit has been exceeded
         */
        if(await this.applyRateLimitSecurity(context) === null) {
            return;
        }
        
        /**
         * Check if the authorized user passes the has role security
         */
        if (await this.applyHasRoleSecurity(context) === null) {
            return;
        }
        
        /**
         * Check if the authorized user passes the has scope security
         */
        if (await this.applyHasScopeSecurity(context) === null) {
            return;
        }
                
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
        const securityHasRoles = SecurityReader.findMany(routeOptions, SecurityEnum.HAS_ROLE);
 
        for(const securityHasRole of securityHasRoles) {
            if (!(await securityHasRole.execute(context))) {
                responseError(context.getRequest(), context.getResponse(), new ForbiddenResourceError(), 403)
                return null;
            }
        }
    
    }

    /**
     * Applies the has scope security
     * @param context The HttpContext
     * @returns void | null
     */
    protected async applyHasScopeSecurity(context: HttpContext): Promise<void | null> {
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new SecurityException('Route options not found');
        }   

        // Check if the hasScope security has been defined and validate
        const securityScopes = SecurityReader.findMany(routeOptions, SecurityEnum.ENABLE_SCOPES);
 
        for(const securityScope of securityScopes) {
            if (!(await securityScope.execute(context))) {
                responseError(context.getRequest(), context.getResponse(), new ForbiddenResourceError(), 403)
                return null;
            }
        }
    }

    /**
     * Applies the rate limit security
     * @param context The HttpContext
     * @returns void | null
     */
    protected async applyRateLimitSecurity(context: HttpContext): Promise<void | null> {

        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new SecurityException('Route options not found');
        }
    
        // Find the rate limited security
        const securityRateLimits = SecurityReader.findMany(routeOptions, SecurityEnum.RATE_LIMITED);
    
        for(const securityRateLimit of securityRateLimits) {
            if (!(await securityRateLimit.execute(context))) {
                responseError(context.getRequest(), context.getResponse(), new RateLimitedExceededError(), 429)
                return null;
            }
        }
    }

}

export default SecurityMiddleware;
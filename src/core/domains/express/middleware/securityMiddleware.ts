import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import RateLimitedExceededError from '@src/core/domains/auth/exceptions/RateLimitedExceededError';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import AuthRequest from '@src/core/domains/auth/services/AuthRequest';
import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import { ISecurityMiddleware } from '@src/core/domains/express/interfaces/ISecurity';
import responseError from '@src/core/domains/express/requests/responseError';
import { ALWAYS } from '@src/core/domains/express/services/Security';
import SecurityReader from '@src/core/domains/express/services/SecurityReader';
import { SecurityIdentifiers } from '@src/core/domains/express/services/SecurityRules';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';

const bindSecurityToRequest = (route: IRoute, req: BaseRequest) => {
    req.security = route.security ?? [];
}


/**
 * Applies the authorization security check on the request.
 */
const applyAuthorizeSecurity = async (route: IRoute, req: BaseRequest, res: Response): Promise<void | null> => {

    const conditions = [ALWAYS]

    if (route.resourceType) {
        conditions.push(route.resourceType)
    }

    // Check if the authorize security has been defined for this route
    const authorizeSecurity = SecurityReader.findFromRequest(req, SecurityIdentifiers.AUTHORIZED, conditions);

    if (authorizeSecurity) {
        try {
            // Authorize the request
            req = await AuthRequest.attemptAuthorizeRequest(req);

            // Validate the authentication
            if (!authorizeSecurity.callback(req)) {
                responseError(req, res, new UnauthorizedError(), 401);
                return null;
            }
        }
        catch (err) {

            // Conditionally throw error
            if (err instanceof UnauthorizedError && authorizeSecurity.arguements?.throwExceptionOnUnauthorized) {
                throw err;
            }

            // Continue processing    
        }
    }
}

/**
 * Checks if the hasRole security has been defined and validates it.
 * If the hasRole security is defined and the validation fails, it will send a 403 response with a ForbiddenResourceError.
 */
const applyHasRoleSecurity = (req: BaseRequest, res: Response): void | null => {
    // Check if the hasRole security has been defined and validate
    const securityHasRole = SecurityReader.findFromRequest(req, SecurityIdentifiers.HAS_ROLE);

    if (securityHasRole && !securityHasRole.callback(req)) {
        responseError(req, res, new ForbiddenResourceError(), 403)
        return null;
    }

}

/**
 * Checks if the hasRole security has been defined and validates it.
 * If the hasRole security is defined and the validation fails, it will send a 403 response with a ForbiddenResourceError.
 */
const applyHasScopeSecurity = (req: BaseRequest, res: Response): void | null => {

    // Check if the hasRole security has been defined and validate
    const securityHasScope = SecurityReader.findFromRequest(req, SecurityIdentifiers.HAS_SCOPE);

    if (securityHasScope && !securityHasScope.callback(req)) {
        responseError(req, res, new ForbiddenResourceError(), 403)
        return null;
    }

}

/**
 * Checks if the rate limited security has been defined and validates it.
 * If the rate limited security is defined and the validation fails, it will send a 429 response with a RateLimitedExceededError.
 */
const applyRateLimitSecurity = async (req: BaseRequest, res: Response): Promise<void | null> => {
    
    // Find the rate limited security
    const securityRateLimit = SecurityReader.findFromRequest(req, SecurityIdentifiers.RATE_LIMITED);

    if (securityRateLimit && !securityRateLimit.callback(req)) {
        responseError(req, res, new RateLimitedExceededError(), 429)
        return null;
    }
}

/**
 * Security middleware for Express routes.
 * 
 * This middleware check for defined security rules defined on the route.
 * - Authorized (allow continue of processing, this is particular useful for RouteResource actions)
 * - Authorized throw exceptions (Returns a 401 immediately if authorization fails)
 * - Checks rate limits
 * - Check authorized scopes
 * - Check authorized roles
 *
 * @param {IRoute} route - The Express route
 * @return {(req: BaseRequest, res: Response, next: NextFunction) => Promise<void>}
 */
export const securityMiddleware: ISecurityMiddleware = ({ route }) => async (req: BaseRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        /**
         * Adds security rules to the Express Request
         * This is used below to find the defined security rules
         */
        bindSecurityToRequest(route, req);


        /**
         * Check if the rate limit has been exceeded
         */
        if(await applyRateLimitSecurity(req, res) === null) {
            return;
        }

        /**
         * Authorizes the user
         * Depending on option 'throwExceptionOnUnauthorized', can allow continue processing on failed auth
         */
        if (await applyAuthorizeSecurity(route, req, res) === null) {
            return;
        }

        /**
         * Check if the authorized user passes the has role security
         */
        if (applyHasRoleSecurity(req, res) === null) {
            return;
        }

        /**
         * Check if the authorized user passes the has scope security
         */
        if (applyHasScopeSecurity(req, res) === null) {
            return;
        }

        /**
         * All security checks have passed
         */
        next();
    }
    catch (error) {
        if (error instanceof UnauthorizedError) {
            responseError(req, res, error, 401)
            return;
        }

        if (error instanceof RateLimitedExceededError) {
            responseError(req, res, error, 429)
            return;
        }

        if (error instanceof ForbiddenResourceError) {
            responseError(req, res, error, 403)
            return;
        }

        if (error instanceof Error) {
            responseError(req, res, error)
            return;
        }
    }
};
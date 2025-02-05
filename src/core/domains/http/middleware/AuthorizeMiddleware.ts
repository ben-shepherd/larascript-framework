import ForbiddenResourceError from '@src/core/domains/auth-legacy/exceptions/ForbiddenResourceError';
import UnauthorizedError from '@src/core/domains/auth-legacy/exceptions/UnauthorizedError';
import AuthRequest from '@src/core/domains/auth-legacy/services/AuthRequest';
import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import responseError from '@src/core/domains/http/handlers/responseError';
import { ray } from 'node-ray';

/**
 * AuthorizeMiddleware handles authentication and authorization for HTTP requests
 * 
 * This middleware:
 * - Validates the authorization header and authenticates the request
 * - Attaches the authenticated user and API token to the request context
 * - Validates that the API token has the required scopes for the route
 * - Returns appropriate error responses for unauthorized/forbidden requests
 *
 * Key features:
 * - Request authentication via AuthRequest service
 * - Scope-based authorization
 * - Standardized error handling for auth failures
 * - Integration with request context for user/token storage
 *
 * Used as middleware on routes requiring authentication. Can be configured with
 * required scopes that are validated against the API token's allowed scopes.
 */

class AuthorizeMiddleware extends Middleware<{ scopes: string[] }> {

    async execute(context: HttpContext): Promise<void> {
        try {

            // Authorize the request
            // Parses the authorization header
            // If successful, attaches the user and apiToken to the request
            // and sets the user in the App
            await AuthRequest.attemptAuthorizeRequest(context.getRequest());
            
            // Validate the scopes if the authorization was successful
            this.validateScopes(context)
            this.next();

            ray('AuthorizeMiddleware executed')
        }
        catch (error) {
            ray('AuthorizeMiddleware error', error)

            if(error instanceof UnauthorizedError) {
                responseError(context.getRequest(), context.getResponse(), error, 401)
                return;
            }
    
            if(error instanceof ForbiddenResourceError) {
                responseError(context.getRequest(), context.getResponse(), error, 403)
            }
    
            if(error instanceof Error) {
                responseError(context.getRequest(), context.getResponse(), error)
                return;
            }
        }
    }

    /**
     * Validates that the scopes in the api token match the required scopes for the request.
     * If the scopes do not match, it will throw a ForbiddenResourceError.
     * If no api token is found, it will throw a UnauthorizedError.
     * @param scopes The scopes required for the request
     * @param req The request object
     * @param res The response object
     */
     
    validateScopes(context: HttpContext): void | null {
        const scopes = context.getRouteItem()?.scopes ?? []

        if(scopes.length === 0) {
            return;
        }

        const apiToken = context.getRequest().apiToken;

        if(!apiToken) {
            throw new UnauthorizedError();
        }
    
        if(!apiToken.hasScope(scopes)) {
            throw new ForbiddenResourceError();
        }
    }

}

export default AuthorizeMiddleware;
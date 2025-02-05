import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import responseError from '@src/core/domains/http/handlers/responseError';

import { requestContext } from '../../http/context/RequestContext';
import { TBaseRequest } from '../../http/interfaces/BaseRequest';
import ForbiddenResourceError from '../exceptions/ForbiddenResourceError';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import { auth } from '../services/AuthService';

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

            // Attempt to authorize the request
            await this.attemptAuthorizeRequest(context.getRequest());

            // Validate the scopes if the authorization was successful
            this.validateScopes(context)

            // Continue to the next middleware
            this.next();
        }
        catch (error) {
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
     * Attempts to authorize a request with a Bearer token.
     * 
     * If successful, attaches the user and apiToken to the request. Sets the user in the App.
     * 
     * @param req The request to authorize
     * @returns The authorized request
     * @throws UnauthorizedError if the token is invalid
     */
    public async attemptAuthorizeRequest(req: TBaseRequest): Promise<TBaseRequest> {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');
    
        const apiToken = await auth().getJwtAdapter().attemptAuthenticateToken(authorization)
    
        const user = await apiToken?.getUser()
    
        if(!user || !apiToken) {
            throw new UnauthorizedError();
        }
    
        // Set the user and apiToken in the request
        req.user = user;
        req.apiToken = apiToken
        
        // Set the user id in the request context
        requestContext().setByRequest(req, 'userId', user?.getId())
    
        return req;
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
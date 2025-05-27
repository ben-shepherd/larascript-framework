import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import { auth } from '@src/core/domains/auth/services/AuthService';
import { authJwt } from '@src/core/domains/auth/services/JwtAuthService';
import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import responseError from '@src/core/domains/http/handlers/responseError';
import { TBaseRequest } from '@src/core/domains/http/interfaces/BaseRequest';

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
            // Skip authorization check for OPTIONS requests
            if (context.getRequest().method === 'OPTIONS') {
                this.next();
                return;
            }

            // Attempt to authorize the request
            await this.attemptAuthorizeRequest(context.getRequest());

            // Validate the scopes of the request
            if (!await this.validateScopes(context)) {
                throw new ForbiddenResourceError();
            }

            this.next();
        }
        catch (error) {
            if (error instanceof UnauthorizedError) {
                responseError(context.getRequest(), context.getResponse(), error, 401)
            }
            else if (error instanceof ForbiddenResourceError) {
                responseError(context.getRequest(), context.getResponse(), error, 403)
            }
            else if (error instanceof Error) {
                responseError(context.getRequest(), context.getResponse(), error)
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

        if (!user || !apiToken) {
            throw new UnauthorizedError();
        }

        // Set the user and apiToken in the request
        req.user = user;
        req.apiToken = apiToken

        // Set the user id in the request context
        authJwt().authorizeUser(user)

        return req;
    }

    /**
     * Validates the scopes of the request
     * @param context - The HTTP context
     * @param scopes - The scopes to validate
     * @returns True if the scopes are valid, false otherwise
     */
    async validateScopes(context: HttpContext): Promise<boolean> {
        const scopes = this.config?.scopes ?? [];
        const apiToken = context.getRequest().apiToken;

        if (!apiToken) {
            return false;
        }

        return apiToken.hasScope(scopes, true);
    }

}

export default AuthorizeMiddleware;
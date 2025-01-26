import ForbiddenResourceError from '@src/core/domains/auth/exceptions/ForbiddenResourceError';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import AuthRequest from '@src/core/domains/auth/services/AuthRequest';
import responseError from '@src/core/domains/express/requests/responseError';
import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { Response } from 'express';
import Middleware from '@src/core/domains/express/base/Middleware';
import HttpContext from '@src/core/domains/express/data/HttpContext';

class AuthorizeMiddleware extends Middleware<{ scopes: string[] }> {

    async execute(context: HttpContext): Promise<void> {
        try {

            // Authorize the request
            // Parses the authorization header
            // If successful, attaches the user and apiToken to the request
            // and sets the user in the App
            await AuthRequest.attemptAuthorizeRequest(context.getRequest());
            
            // Validate the scopes if the authorization was successful
            this.validateScopes(this.config.scopes, context.getRequest(), context.getResponse())
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
     * Validates that the scopes in the api token match the required scopes for the request.
     * If the scopes do not match, it will throw a ForbiddenResourceError.
     * If no api token is found, it will throw a UnauthorizedError.
     * @param scopes The scopes required for the request
     * @param req The request object
     * @param res The response object
     */
    // eslint-disable-next-line no-unused-vars
    validateScopes(scopes: string[], req: BaseRequest, res: Response): void | null {
        if(scopes.length === 0) {
            return;
        }

        const apiToken = req.apiToken;

        if(!apiToken) {
            throw new UnauthorizedError();
        }
    
        if(!apiToken.hasScope(scopes)) {
            throw new ForbiddenResourceError();
        }
    }

}

export default AuthorizeMiddleware;
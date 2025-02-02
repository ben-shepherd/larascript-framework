import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import { auth } from "@src/core/domains/auth/services/AuthService";
import { TBaseRequest } from "@src/core/domains/http/interfaces/BaseRequest";
import { App } from "@src/core/services/App";

class AuthRequest {

    /**
     * Attempts to authorize a request with a Bearer token.
     * 
     * If successful, attaches the user and apiToken to the request. Sets the user in the App.
     * 
     * @param req The request to authorize
     * @returns The authorized request
     * @throws UnauthorizedError if the token is invalid
     */
    public static async attemptAuthorizeRequest(req: TBaseRequest): Promise<TBaseRequest> {
        const authorization = (req.headers.authorization ?? '').replace('Bearer ', '');

        const apiToken = await auth().attemptAuthenticateToken(authorization)

        const user = await apiToken?.getAttribute('user') as IUserModel | null;

        if(!user || !apiToken) {
            throw new UnauthorizedError();
        }

        req.user = user;
        req.apiToken = apiToken
        
        App.container('requestContext').setByRequest(req, 'userId', user?.getId())

        return req;
    }

}

export default AuthRequest
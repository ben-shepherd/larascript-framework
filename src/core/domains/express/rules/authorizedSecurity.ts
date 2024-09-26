
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { App } from "@src/core/services/App";


/**
 * Checks if the request is authorized, i.e. if the user is logged in.
 *
 * @param req - The Express Request object
 * @returns True if the user is logged in, false otherwise
 */
const authorizedSecurity = (req: BaseRequest): boolean => {
    if(App.container('requestContext').getByRequest(req, 'userId')) {
        return true;
    }

    return false;
}

export default authorizedSecurity
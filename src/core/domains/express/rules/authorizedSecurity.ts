
import CurrentRequest from "@src/core/domains/express/services/CurrentRequest";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";


/**
 * Checks if the request is authorized, i.e. if the user is logged in.
 *
 * @param req - The Express Request object
 * @returns True if the user is logged in, false otherwise
 */
const authorizedSecurity = (req: BaseRequest): boolean => {
    if(CurrentRequest.getByRequest(req, 'userId')) {
        return true;
    }

    return false;
}

export default authorizedSecurity
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

/**
 * Checks if the given scope(s) are present in the scopes of the current request's API token.
 * If no API token is found, it will return false.
 * @param req The request object
 * @param scope The scope(s) to check
 * @returns True if all scopes are present, false otherwise
 */
const hasScopeSecurity = (req: BaseRequest, scope: string | string[]): boolean => {
    const apiToken = req.apiToken;

    if(!apiToken) {
        return false;
    }

    return apiToken?.hasScope(scope) 
}

export default hasScopeSecurity
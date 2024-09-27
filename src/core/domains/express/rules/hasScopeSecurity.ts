import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

/**
 * Checks if the given scope(s) are present in the scopes of the current request's API token.
 * If no API token is found, it will return false.
 * @param req The request object
 * @param scopesExactMatch The scope(s) to check - must be an exact match - ignores empty scopes
 * @param scopesPartialMatch The scope(s) to check - must be a partial match - ignores empty scopes
 * @returns True if all scopes are present, false otherwise
 */
const hasScopeSecurity = (req: BaseRequest, scopesExactMatch: string | string[], scopesPartialMatch: string | string[]): boolean => {
    const apiToken = req.apiToken;

    if(!apiToken) {
        return false;
    }

    if(scopesPartialMatch.length && !apiToken.hasScope(scopesPartialMatch, false)) {
        return false
    }

    if(scopesExactMatch.length && !apiToken.hasScope(scopesExactMatch, true)) {
        return false
    }

    return true;
}

export default hasScopeSecurity
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { IIdentifiableSecurityCallback } from "@src/core/domains/express/interfaces/ISecurity";
import { ALWAYS } from "@src/core/domains/express/services/Security";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

class SecurityReader {

    /**
     * Finds a security callback in the security callbacks of the given route resource options.
     *
     * @param options - The route resource options containing the security callbacks.
     * @param id - The id of the security callback to find.
     * @param when - The optional when condition. If specified, the security callback will only be found if it matches this condition.
     * @returns The found security callback, or undefined if not found.
     */
    public static findFromRouteResourceOptions(options: IRouteResourceOptions, id: string, when?: string[] | null): IIdentifiableSecurityCallback | undefined {
        return this.find(options.security ?? [], id, when);
    }

    /**
     * Finds a security callback from the security callbacks associated with the given request.
     *
     * @param req - The request object containing the security callbacks.
     * @param id - The id of the security callback to find.
     * @param when - The optional when condition. If specified, the security callback will only be found if it matches this condition.
     * @returns The found security callback, or undefined if not found.
     */
    public static findFromRequest(req: BaseRequest, id: string, when?: string[] | null): IIdentifiableSecurityCallback | undefined {
        return this.find(req.security ?? [], id, when);
    }

    /**
     * Finds a security callback in the given array of security callbacks.
     *
     * @param security - The array of security callbacks to search.
     * @param options - The route resource options containing the security callbacks.
     * @param id - The id of the security callback to find.
     * @param when - The when condition to match. If not provided, the method will return the first match.
     * @returns The security callback if found, or undefined if not found.
     */
    public static find(security: IIdentifiableSecurityCallback[], id: string, when?: string[] | null): IIdentifiableSecurityCallback | undefined {
        when = when ?? null;
        when = when && typeof when === 'string' ? [when] : when;

        // Checks if the condition should never be passable
        const conditionNeverPassable = (conditions: string[] | null, never: string[] | null = null) => {
            if(!never) return false;

            for(const neverCondition of never) { 
                if(conditions?.includes(neverCondition)) return true;
            }

            return false;
        }

        // Checks if the condition should be passable
        const conditionPassable = (condition: string[] | null) => {
            if(!condition) {
                return true;
            }

            condition = typeof condition === 'string' ? [condition] : condition;

            if(when?.includes(ALWAYS)) return true;

            for(const conditionString of condition) {
                if(when?.includes(conditionString)) {
                    return true;
                }
            }

            return false;
        }

        return security?.find(security => {
            return security.id === id && 
                conditionNeverPassable(when, security.never) === false &&
                conditionPassable(security.when);
        });
    }

}

export default SecurityReader
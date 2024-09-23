
import { IdentifiableSecurityCallback } from "@src/core/domains/auth/services/Security";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
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
    public static findFromRouteResourceOptions(options: IRouteResourceOptions, id: string, when?: string): IdentifiableSecurityCallback | undefined {
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
    public static findFromRequest(req: BaseRequest, id: string, when?: string): IdentifiableSecurityCallback | undefined {
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
    public static find(security: IdentifiableSecurityCallback[], id: string, when?: string): IdentifiableSecurityCallback | undefined {
        return security?.find(security => {

            const matchesWhenCondition = when !== 'always' && security.when === when;

            return security.id === id && matchesWhenCondition;
        });
    }

}

export default SecurityReader
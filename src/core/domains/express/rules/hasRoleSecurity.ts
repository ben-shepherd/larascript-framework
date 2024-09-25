import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

/**
 * Checks if the currently logged in user has the given role(s).
 *
 * @param {BaseRequest} req - The Express Request object
 * @param {string | string[]} roles - The role(s) to check
 * @returns {boolean} True if the user has the role, false otherwise
 */
const hasRoleSecurity = (req: BaseRequest, roles: string | string[]): boolean => {
    const user = req.user;

    if(!user) {
        return false;
    }

    return user?.hasRole(roles) ?? false
}

export default hasRoleSecurity
import User from "@src/app/models/auth/User";
import { IModel } from "@src/core/interfaces/IModel";

import CurrentRequest from "../../express/services/CurrentRequest";
import { BaseRequest } from "../../express/types/BaseRequest.t";

/**
 * Checks if the currently logged in user is the owner of the given resource.
 *
 * @param req - The request object
 * @param resource - The resource object
 * @param attribute - The attribute name that should contain the user id
 * @returns True if the user is the resource owner, false otherwise
 */
const resourceOwnerSecurity = (req: BaseRequest, resource: IModel, attribute: string): boolean => {
    const user = CurrentRequest.get<User>(req, 'user');

    if(!user) {
        return false;
    }

    if(typeof resource.getAttribute !== 'function') {
        throw new Error('Resource is not an instance of IModel');
    }

    return resource.getAttribute(attribute) === user?.getId()
}

export default resourceOwnerSecurity
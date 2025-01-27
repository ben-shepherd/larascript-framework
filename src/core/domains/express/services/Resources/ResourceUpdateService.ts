import Repository from "@src/core/base/Repository";
import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import BaseResourceService from "@src/core/domains/express/services/Resources/BaseResourceService";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { Response } from "express";

import { IRouteResourceOptionsLegacy } from "../../interfaces/IRouteResourceOptionsLegacy";
import { RouteResourceTypes } from "../../routing/RouteResource";


class ResourceUpdateService extends BaseResourceService {

    routeResourceType: string = RouteResourceTypes.UPDATE

    /**
     * Handles the resource delete action
     * - Validates that the request is authorized
     * - Checks if the resource owner security applies to this route and it is valid
     * - Deletes the resource
     * - Sends the results back to the client
     * @param {BaseRequest} req - The request object
     * @param {Response} res - The response object
     * @param {IRouteResourceOptionsLegacy} options - The options object
     * @returns {Promise<void>}
     */
    async handler(req: BaseRequest, res: Response, options: IRouteResourceOptionsLegacy): Promise<void> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(req, options)) {
            throw new UnauthorizedError()
        }
        
        const repository = new Repository(options.resource)

        const result = await repository.findById(req.params?.id)

        if (!result) {
            throw new ModelNotFound();
        }

        // Check if the resource owner security applies to this route and it is valid
        if(!this.validateResourceOwnerCallback(req, options, result)) {
            throw new ForbiddenResourceError()
        }

        await result.fill(req.body);
        await result.save();

        // Send the results
        res.send(await stripGuardedResourceProperties(result))
    }
        
}

export default ResourceUpdateService;
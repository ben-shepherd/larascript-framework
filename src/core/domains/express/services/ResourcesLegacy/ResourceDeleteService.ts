import Repository from "@src/core/base/Repository";
import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import BaseResourceServiceLegacy from "@src/core/domains/express/services/ResourcesLegacy/BaseResourceServiceLegacy";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { Response } from "express";
import { IRouteResourceOptionsLegacy } from "@src/core/domains/express/interfaces/IRouteResourceOptionsLegacy";
import { RouteResourceTypes } from "@src/core/domains/express/routing/RouteResource";


class ResourceDeleteService extends BaseResourceServiceLegacy {

    routeResourceType: string = RouteResourceTypes.DELETE

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

        if(!result) {
            throw new ModelNotFound()
        }

        // Check if the resource owner security applies to this route and it is valid
        if(!this.validateResourceOwnerCallback(req, options, result)) {
            throw new ForbiddenResourceError()
        }

        // Delete the resource item
        await result.delete()

        // Send the results
        res.send({ success: true })
    }
        
}

export default ResourceDeleteService;
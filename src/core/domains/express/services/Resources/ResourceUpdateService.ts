import Repository from "@src/core/base/Repository";
import ForbiddenResourceError from "@src/core/domains/auth/exceptions/ForbiddenResourceError";
import UnauthorizedError from "@src/core/domains/auth/exceptions/UnauthorizedError";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import stripGuardedResourceProperties from "@src/core/domains/express/utils/stripGuardedResourceProperties";
import ModelNotFound from "@src/core/exceptions/ModelNotFound";
import { IModelAttributes, ModelConstructor } from "@src/core/interfaces/IModel";
import { Response } from "express";

import HttpContext from "../../data/HttpContext";
import ResourceException from "../../exceptions/ResourceException";
import { IRouteResourceOptionsLegacy } from "../../interfaces/IRouteResourceOptionsLegacy";
import { RouteResourceTypes } from "../../routing/RouteResource";
import BaseResourceService from "./BaseResourceService";


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
    async handler(context: HttpContext): Promise<IModelAttributes> {

        // Check if the authorization security applies to this route and it is valid
        if(!this.validateAuthorization(context)) {
            throw new UnauthorizedError()
        }
        
        const routeOptions = context.getRouteItem()

        if(!routeOptions) {
            throw new ResourceException('Route options are required')
        }

        const modelConstructor = routeOptions.resourceConstructor as ModelConstructor

        const repository = new Repository(modelConstructor)

        const result = await repository.findById(context.getRequest().params?.id)

        if (!result) {
            throw new ModelNotFound();
        }

        // Check if the resource owner security applies to this route and it is valid
        if(!this.validateResourceOwner(context)) {
            throw new ForbiddenResourceError()
        }

        await result.fill(context.getRequest().body);
        await result.save();

        // Send the results
        return await stripGuardedResourceProperties(result)[0]
    }
        
}

export default ResourceUpdateService;
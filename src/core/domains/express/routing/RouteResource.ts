
import ResourceController from "../controllers/resource/ResourceController";
import { TRouteResourceOptions } from "../interfaces/IRoute";
import Router from "./Router";

/**
 * Resource types that can be utilized when adding Security to a route
 */
export const RouteResourceTypes = {
    INDEX: 'index',
    SHOW: 'show',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete'
} as const

class ResourceRouter {

    /**
     * Add resource routes to the router.
     */
    public static resource(options: TRouteResourceOptions, router: Router = new Router()): Router {
        
        router.group({
            prefix: options.path,
            controller: ResourceController,
        }, (router) => {
            
            router.get('/', 'index', {
                resourceType: RouteResourceTypes.INDEX,
            });
            router.get('/:id', 'show', {
                resourceType: RouteResourceTypes.SHOW,
            });
            router.post('/', 'create', {
                resourceType: RouteResourceTypes.CREATE,
            });
            router.put('/:id', 'update', {
                resourceType: RouteResourceTypes.UPDATE,
            });
            router.delete('/:id', 'delete', {
                resourceType: RouteResourceTypes.DELETE,
            });
        })


        return router;
    }

}

export default ResourceRouter
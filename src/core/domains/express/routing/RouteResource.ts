
import ResourceController from "@src/core/domains/express/controllers/resource/ResourceController";
import { TPartialRouteItemOptions, TRouteResourceOptions } from "@src/core/domains/express/interfaces/IRoute";
import Router from "@src/core/domains/express/routing/Router";

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
    public static resource({ prefix, resource, ...rest }: TRouteResourceOptions, router: Router = new Router()): Router {

        const routeItemOptions: TPartialRouteItemOptions = {
            resourceConstructor: resource,
            ...rest,
        }

        router.group({
            prefix,
            controller: ResourceController,
            ...rest
        }, (router) => {
            
            router.get('/', 'index', {
                ...routeItemOptions,
                resourceType: RouteResourceTypes.INDEX,
            });
            router.get('/:id', 'show', {
                ...routeItemOptions,
                resourceType: RouteResourceTypes.SHOW,
            });
            router.post('/', 'create', {
                ...routeItemOptions,
                resourceType: RouteResourceTypes.CREATE,
            });
            router.put('/:id', 'update', {
                ...routeItemOptions,
                resourceType: RouteResourceTypes.UPDATE,
            });
            router.delete('/:id', 'delete', {
                ...routeItemOptions,
                resourceType: RouteResourceTypes.DELETE,
            });
        })


        return router;
    }

}

export default ResourceRouter

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

/**
 * ResourceRouter provides a standardized way to create RESTful resource routes
 * 
 * It automatically generates the following routes for a given resource:
 * - GET / - Index route to list resources
 * - GET /:id - Show route to get a single resource
 * - POST / - Create route to add a new resource
 * - PUT /:id - Update route to modify an existing resource
 * - DELETE /:id - Delete route to remove a resource
 * 
 * Usage:
 * ```
 * routes.resource({
 *   prefix: '/blogs',
 *   resource: BlogModel,
 *   middlewares: [AuthMiddleware],
 *   security: [SecurityRules.resourceOwner('user_id')]
 * })
 * ```
 * 
 * The router:
 * - Maps routes to ResourceController methods
 * - Applies provided middleware and security rules
 * - Sets up proper route parameters
 * - Handles resource type tracking for security validation
 * - Maintains consistent RESTful routing patterns
 */

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
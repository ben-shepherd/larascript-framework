
import { TPartialRouteItemOptions, TResourceType, TRouteResourceOptions } from "@src/core/domains/http/interfaces/IRouter";
import ResourceController from "@src/core/domains/http/resources/controller/ResourceController";
import Router from "@src/core/domains/http/router/Router";

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
 *   security: [SecurityRules.resourceOwner('user_id')],
 *   filters: {
 *       index: {
 *           active: true
 *       },
 *       show: {
 *           active: true
 *       }
 *   }

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
    public static resource({ prefix, resource, scopes: additionalScopes = [], filters, searching, paginate, sorting, validation, security, ...rest }: TRouteResourceOptions, router: Router = new Router()): Router {

        const routeItemOptions: TPartialRouteItemOptions = {
            prefix,
            ...rest,
        }

        const registerIndex = this.shouldRegisterType(RouteResourceTypes.INDEX, rest.only)
        const registerShow = this.shouldRegisterType(RouteResourceTypes.SHOW, rest.only)
        const registerCreate = this.shouldRegisterType(RouteResourceTypes.CREATE, rest.only)
        const registerUpdate = this.shouldRegisterType(RouteResourceTypes.UPDATE, rest.only)
        const registerDelete = this.shouldRegisterType(RouteResourceTypes.DELETE, rest.only)

        router.group({
            prefix,
            controller: ResourceController,
            ...rest
        }, (router) => {
            
            if(registerIndex) {
                router.get('/', 'index', {
                    ...routeItemOptions,
                    resource: {
                        type: RouteResourceTypes.INDEX,
                        modelConstructor: resource,
                        scopes: resource.getScopes(['read'], additionalScopes),
                        filters: filters ?? {},
                        searching: searching ?? {},
                        paginate: paginate ?? {},
                        sorting: sorting
                    },
                    security: security ?? []
                });
            }

            if(registerShow) {
                router.get('/:id', 'show', {
                    ...routeItemOptions,
                    resource: {

                        type: RouteResourceTypes.SHOW,
                        modelConstructor: resource,
                        scopes: resource.getScopes(['read'], additionalScopes),
                        filters: filters ?? {},
                        searching: searching ?? {},
                    },
                    security: security ?? []
                });
            }

            if(registerCreate) {
                router.post('/', 'create', {
                    ...routeItemOptions,
                    resource: {
                        type: RouteResourceTypes.CREATE,
                        modelConstructor: resource,
                        scopes: resource.getScopes(['create'], additionalScopes),
                        searching: searching ?? {},
                        validation: validation ?? {}
                    },
                    security: security ?? []
                });
            }

            if(registerUpdate) {
                router.put('/:id', 'update', {
                    ...routeItemOptions,
                    resource: {
                        type: RouteResourceTypes.UPDATE,
                        modelConstructor: resource,
                        scopes: resource.getScopes(['write'], additionalScopes),
                        searching: searching ?? {},
                        validation: validation ?? {}
                    },
                    security: security ?? []
                });
            }

            if(registerDelete) {
                router.delete('/:id', 'delete', {
                    ...routeItemOptions,
                    resource: {
                        type: RouteResourceTypes.DELETE,
                        modelConstructor: resource,
                        scopes: resource.getScopes(['delete'], additionalScopes),
                        searching: searching ?? {}
                    },
                    security: security ?? []
                });
            }
        })


        return router;
    }

    /**
     * Determines if a resource type should be registered based on the provided options.
     * 
     * @param type - The resource type to check
     * @param only - An optional array of resource types to check against
     * @returns true if the type should be registered, false otherwise
     */
    protected static shouldRegisterType (type: TResourceType, only?: TResourceType[]) {
        if(!only) {
            return true
        }
        return only.includes(type)
    }

}

export default ResourceRouter
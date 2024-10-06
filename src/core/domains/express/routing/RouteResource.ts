import ModelScopes from "@src/core/domains/auth/services/ModelScopes";
import baseAction from "@src/core/domains/express/actions/baseAction";
import resourceAll from "@src/core/domains/express/actions/resourceAll";
import resourceCreate from "@src/core/domains/express/actions/resourceCreate";
import resourceDelete from "@src/core/domains/express/actions/resourceDelete";
import resourceShow from "@src/core/domains/express/actions/resourceShow";
import resourceUpdate from "@src/core/domains/express/actions/resourceUpdate";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import Route from "@src/core/domains/express/routing/Route";
import RouteGroup from "@src/core/domains/express/routing/RouteGroup";
import routeGroupUtil from "@src/core/domains/express/utils/routeGroupUtil";

/**
 * Resource types that can be utilized when adding Security to a route
 */
export const RouteResourceTypes = {
    ALL: 'all',
    SHOW: 'show',
    CREATE: 'create',
    UPDATE: 'update',
    DESTROY: 'destroy'
} as const

/**
 * Returns a group of routes for a given resource
 * - name.index - GET - /name
 * - name.show - GET - /name/:id
 * - name.update - PUT - /name/:id
 * - name.create - POST - /name
 * - name.delete - DELETE - /name/:id
 * 
 * @param options.resource - The model constructor of the resource
 * @param options.name - The name of the resource (will be used as the base path)
 * @param options.only - An array of resource types to include in the routes
 * @param options.except - An array of resource types to exclude from the routes
 * @param options.createValidator - A validator to use for the create route
 * @param options.updateValidator - A validator to use for the update route
 * @param options.enableScopes - Enable scopes security for these routes
 * @returns A group of routes that can be used to handle requests for the resource
 */
const RouteResource = (options: IRouteResourceOptions): IRoute[] => {
    const path = options.path.startsWith('/') ? options.path.slice(1) : options.path

    const {
        resource,
        scopes = [],
        enableScopes,
    } = options;

    /**
     * Define all the routes for the resource
     */
    const routes = RouteGroup([
        // Get all resources
        Route({
            name: `${path}.all`,
            resourceType: RouteResourceTypes.ALL,
            scopes,
            scopesPartial: ModelScopes.getScopes(resource, ['read', 'all']),
            enableScopes,
            method: 'get',
            path: `/${path}`,
            action: baseAction(options, resourceAll),
            middlewares: options.middlewares,
            security: options.security
        }),
        // Get resource by id
        Route({
            name: `${path}.show`,
            resourceType: RouteResourceTypes.SHOW,
            scopes,
            scopesPartial: ModelScopes.getScopes(resource, ['read', 'all']),
            enableScopes,
            method: 'get',
            path: `/${path}/:id`,
            action: baseAction(options, resourceShow),
            middlewares: options.middlewares,
            security: options.security
        }),
        // Update resource by id
        Route({
            name: `${path}.update`,
            resourceType: RouteResourceTypes.UPDATE,
            scopes,
            scopesPartial: ModelScopes.getScopes(resource, ['write', 'all']),
            enableScopes,
            method: 'put',
            path: `/${path}/:id`,
            action: baseAction(options, resourceUpdate),
            validator: options.updateValidator,
            middlewares: options.middlewares,
            security: options.security
        }),
        // Delete resource by id
        Route({
            name: `${path}.destroy`,
            resourceType: RouteResourceTypes.DESTROY,
            scopes,
            scopesPartial: ModelScopes.getScopes(resource, ['delete', 'all']),
            enableScopes,
            method: 'delete',
            path: `/${path}/:id`,
            action: baseAction(options, resourceDelete),
            middlewares: options.middlewares,
            security: options.security
        }),
        // Create resource
        Route({
            name: `${path}.create`,
            resourceType: RouteResourceTypes.CREATE,
            scopes,
            scopesPartial: ModelScopes.getScopes(resource, ['create', 'all']),
            enableScopes,
            method: 'post',
            path: `/${path}`,
            action: baseAction(options, resourceCreate),
            validator: options.createValidator,
            middlewares: options.middlewares,
            security: options.security
        })
    ])

    // Apply only and except filters
    return routeGroupUtil.filterExcept(
        options.except ?? [],
        routeGroupUtil.filterOnly(options.only ?? [], routes)
    )
}

export default RouteResource
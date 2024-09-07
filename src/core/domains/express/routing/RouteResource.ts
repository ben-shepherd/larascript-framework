import resourceAction from "@src/core/domains/express/actions/resourceAction";
import resourceCreate from "@src/core/domains/express/actions/resourceCreate";
import resourceDelete from "@src/core/domains/express/actions/resourceDelete";
import resourceIndex from "@src/core/domains/express/actions/resourceIndex";
import resourceShow from "@src/core/domains/express/actions/resourceShow";
import resourceUpdate from "@src/core/domains/express/actions/resourceUpdate";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import { IRouteResourceOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import routeGroupUtil from "@src/core/domains/express/utils/routeGroupUtil";
import Route from "@src/core/domains/express/routing/Route";
import RouteGroup from "@src/core/domains/express/routing/RouteGroup";

const RouteResource = (options: IRouteResourceOptions): IRoute[] => {
    const name = options.name.startsWith('/') ? options.name.slice(1) : options.name

    const routes = RouteGroup([
    // Get all resources
        Route({
            name: `${name}.index`,
            method: 'get',
            path: `/${name}`,
            action: resourceAction(options, resourceIndex)
        }),
        // Get resource by id
        Route({
            name: `${name}.show`,
            method: 'get',
            path: `/${name}/:id`,
            action: resourceAction(options, resourceShow)
        }),
        // Update resource by id
        Route({
            name: `${name}.update`,
            method: 'put',
            path: `/${name}/:id`,
            action: resourceAction(options, resourceUpdate),
            validator: options.updateValidator
        }),
        // Delete resource by id
        Route({
            name: `${name}.destroy`,
            method: 'delete',
            path: `/${name}/:id`,
            action: resourceAction(options, resourceDelete)
        }),
        // Create resource
        Route({
            name: `${name}.create`,
            method: 'post',
            path: `/${name}`,
            action: resourceAction(options, resourceCreate),
            validator: options.createValidator
        })
    ])

    // Apply only and except filters
    return routeGroupUtil.filterExcept(
        options.except ?? [],
        routeGroupUtil.filterOnly(options.only ?? [], routes)
    )
}

export default RouteResource
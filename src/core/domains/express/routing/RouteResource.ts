import resourceAction from "../actions/resourceAction";
import resourceCreate from "../actions/resourceCreate";
import resourceDelete from "../actions/resourceDelete";
import resourceIndex from "../actions/resourceIndex";
import resourceShow from "../actions/resourceShow";
import resourceUpdate from "../actions/resourceUpdate";
import { IRoute } from "../interfaces/IRoute";
import { IRouteResourceOptions } from "../interfaces/IRouteResourceOptions";
import routeGroupUtil from "../utils/routeGroupUtil";
import Route from "./Route";
import RouteGroup from "./RouteGroup";

const RouteResource = (options: IRouteResourceOptions): IRoute[] => {
    let name = options.name.startsWith('/') ? options.name.slice(1) : options.name

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
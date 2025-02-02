import { IRouteLegacy } from "@src/core/domains/http/interfaces/IRouteLegacy"
import { ResourceType } from "@src/core/domains/http/interfaces/IRouteResourceOptionsLegacy"

/**
 * Given a route, returns the ResourceType of the route by extracting the last
 * part of the route's name after splitting on '.'
 * 
 * Example: 
 *   - name: 'users.index'
 *   - ResourceType: 'index'
 * 
 * @param route The route to extract the ResourceType from
 * @returns The ResourceType of the route
 */
const extractResourceType = (route: IRouteLegacy): ResourceType => {
    const parts = route.name.split('.')
    const lastPart = parts[parts.length - 1]
    return lastPart as ResourceType
}

/**
 * Given an array of resource types and an array of routes, filters the routes
 * to only include ones that have a resource type in the given array.
 *
 * If the array of resource types is empty, all routes are returned.
 *
 * @param only The array of resource types to filter by
 * @param routes The array of routes to filter
 * @returns The filtered array of routes
 */
const filterOnly = (only: ResourceType[], routes: IRouteLegacy[]): IRouteLegacy[] => {
    if(only.length === 0) {
        return routes
    }

    return routes.filter(route => {
        return only.includes(
            extractResourceType(route)
        )
    })
}
  

/**
 * Given an array of resource types and an array of routes, filters the routes
 * to exclude ones that have a resource type in the given array.
 *
 * If the array of resource types is empty, all routes are returned.
 *
 * @param except The array of resource types to exclude
 * @param routes The array of routes to filter
 * @returns The filtered array of routes
 */
const filterExcept = (except: ResourceType[], routes: IRouteLegacy[]): IRouteLegacy[] => {
    if(except.length === 0) {
        return routes
    }

    return routes.filter(route => {
        return !except.includes(
            extractResourceType(route)
        )
    })
}

export default Object.freeze({
    filterOnly,
    filterExcept,
    extractResourceType,
})
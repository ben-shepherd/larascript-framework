import { IRoute } from "@src/core/domains/express/interfaces/IRoute"
import { ResourceType } from "@src/core/domains/express/interfaces/IRouteResourceOptions"

const extractResourceType = (route: IRoute): ResourceType => {
    const parts = route.name.split('.')
    const lastPart = parts[parts.length - 1]
    return lastPart as ResourceType
}

const filterOnly = (only: ResourceType[], routes: IRoute[]): IRoute[] => {
    if(only.length === 0) {
        return routes
    }

    return routes.filter(route => {
        return only.includes(
            extractResourceType(route)
        )
    })
}
  

const filterExcept = (except: ResourceType[], routes: IRoute[]): IRoute[] => {
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
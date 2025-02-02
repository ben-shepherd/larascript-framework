import { TRouteItem } from "@src/core/domains/http/interfaces/IRouter";

export interface IExpressable<T = unknown> {
    // eslint-disable-next-line no-unused-vars
    toExpressable(routeItem?: TRouteItem): T
}
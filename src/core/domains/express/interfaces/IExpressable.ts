import { TRouteItem } from "@src/core/domains/express/interfaces/IRoute";

export interface IExpressable<T = unknown> {
    // eslint-disable-next-line no-unused-vars
    toExpressable(routeItem?: TRouteItem): T
}
import { TRouteItem } from "./IRoute";

export interface IExpressable<T = unknown> {
    // eslint-disable-next-line no-unused-vars
    toExpressable(routeItem?: TRouteItem): T
}
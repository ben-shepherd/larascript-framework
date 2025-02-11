import express from "express";

import { TExpressMiddlewareFnOrClass } from "./IMiddleware";

export default interface IHttpConfig {
    enabled: boolean;
    port: number;
    globalMiddlewares?: express.RequestHandler[] | TExpressMiddlewareFnOrClass[];
    currentRequestCleanupDelay?: number;
    logging?: {
        boundRouteDetails?: boolean;
        requests?: boolean;
    }

}
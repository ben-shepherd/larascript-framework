import express from "express";
import { TExpressMiddlewareFnOrClass } from "@src/core/domains/http/interfaces/IMiddleware";

export default interface IHttpConfig {
    enabled: boolean;
    port: number;
    globalMiddlewares?: (express.RequestHandler | TExpressMiddlewareFnOrClass)[];
    currentRequestCleanupDelay?: number;
    logging?: {
        boundRouteDetails?: boolean;
        requests?: boolean;
    }

}
import { TExpressMiddlewareFnOrClass } from "@src/core/domains/http/interfaces/IMiddleware";
import express from "express";

// eslint-disable-next-line no-unused-vars
export type ExtendExpressFn = (app: express.Application) => void

export default interface IHttpConfig {
    enabled: boolean;
    port: number;
    globalMiddlewares?: (express.RequestHandler | TExpressMiddlewareFnOrClass)[];
    currentRequestCleanupDelay?: number;
    extendExpress?: ExtendExpressFn
    csrf?: {
        methods?: string[];
        headerName?: string;
        ttl?: number;
        exclude?: string[];
    }
    logging?: {
        boundRouteDetails?: boolean;
        requests?: boolean;
    }

}
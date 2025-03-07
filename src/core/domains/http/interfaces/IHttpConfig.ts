import { TExpressMiddlewareFnOrClass } from "@src/core/domains/http/interfaces/IMiddleware";
import express from "express";

export default interface IHttpConfig {
    enabled: boolean;
    port: number;
    globalMiddlewares?: (express.RequestHandler | TExpressMiddlewareFnOrClass)[];
    currentRequestCleanupDelay?: number;
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
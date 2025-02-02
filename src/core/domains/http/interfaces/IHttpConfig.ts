import express from "express";

export default interface IHttpConfig {
    enabled: boolean;
    port: number;
    globalMiddlewares?: express.RequestHandler[];
    currentRequestCleanupDelay?: number;
    logging?: {
        boundRouteDetails?: boolean;
        requests?: boolean;
    }

}
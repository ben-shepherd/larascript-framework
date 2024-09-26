import express from "express";

export default interface IExpressConfig {
    enabled: boolean;
    port: number;
    globalMiddlewares?: express.RequestHandler[];
    currentRequestCleanupDelay?: number;
}
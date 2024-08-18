import express from "express";
import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";

export default interface IExpress {
    init(): void;
    bindRoutes(routes: IRoute[]): void;
    getApp(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
}
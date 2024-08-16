import express from "express";
import IExpressConfig from "./IExpressConfig";
import { IRoute } from "./IRoute";

export default interface IExpress {
    init(): void;
    bindRoutes(routes: IRoute[]): void;
    getApp(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
}
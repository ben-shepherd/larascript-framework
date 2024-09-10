import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import express from "express";

export default interface IExpressService {
    init(): void;
    bindRoutes(routes: IRoute[]): void;
    getExpress(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
    isEnabled(): boolean;
    getRoutes(): IRoute[];
}
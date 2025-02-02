/* eslint-disable no-unused-vars */
import IExpressConfig from "@src/core/domains/http/interfaces/IHttpConfig";
import { IRoute, IRouter, TRouteItem } from "@src/core/domains/http/interfaces/IRouter";
import express from "express";

export default interface IHttpService {
    init(): void;
    bindRoutes(route: IRouter): void;
    getExpress(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
    isEnabled(): boolean;
    route(): IRoute;
    getRegisteredRoutes(): TRouteItem[];
}
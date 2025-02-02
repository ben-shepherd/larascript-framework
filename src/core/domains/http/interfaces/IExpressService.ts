/* eslint-disable no-unused-vars */
import IExpressConfig from "@src/core/domains/http/interfaces/IExpressConfig";
import { IRoute, IRouter, TRouteItem } from "@src/core/domains/http/interfaces/IRoute";
import express from "express";

export default interface IExpressService {
    init(): void;
    bindRoutes(route: IRouter): void;
    getExpress(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
    isEnabled(): boolean;
    route(): IRoute;
    getRegisteredRoutes(): TRouteItem[];
}
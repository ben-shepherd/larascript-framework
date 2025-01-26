/* eslint-disable no-unused-vars */
import IExpressConfig from "@src/core/domains/express/interfaces/IExpressConfig";
import { IRouteLegacy } from "@src/core/domains/express/interfaces/IRouteLegacy";
import express from "express";

import { IRoute, IRouter } from "./IRoute";

export default interface IExpressService {
    init(): void;
    bindRoutes(route: IRouter): void;
    bindRoutesLegacy(routes: IRouteLegacy[]): void;
    getExpress(): express.Express;
    listen(): Promise<void>;
    getConfig(): IExpressConfig | null;
    isEnabled(): boolean;
    getRoutes(): IRouteLegacy[];
    route(): IRoute;
}
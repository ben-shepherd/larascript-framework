import express from "express";
import { IRoute } from "./IRoute";

export default interface IExpress {
    bindRoutes(routes: IRoute[]): void;
    getApp(): express.Express;
}
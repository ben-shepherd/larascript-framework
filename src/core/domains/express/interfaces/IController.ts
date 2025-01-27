/* eslint-disable no-unused-vars */
import HttpContext from "../data/HttpContext"
import { TRouteItem } from "./IRoute"

export interface ControllerConstructor {
    new (context: HttpContext): IController
}

export interface IController {
    setContext(context: HttpContext): void
    getRouteOptions(): TRouteItem | undefined
}
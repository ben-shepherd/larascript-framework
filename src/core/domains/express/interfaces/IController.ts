/* eslint-disable no-unused-vars */
import HttpContext from "@src/core/domains/express/data/HttpContext"
import { TRouteItem } from "@src/core/domains/express/interfaces/IRoute"

export interface ControllerConstructor {
    new (context: HttpContext): IController
    executeAction(action: string, context: HttpContext): Promise<void>
}

export interface IController {
    setContext(context: HttpContext): void
    getRouteOptions(): TRouteItem | undefined
}
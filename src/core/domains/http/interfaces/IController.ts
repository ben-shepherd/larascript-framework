/* eslint-disable no-unused-vars */
import HttpContext from "@src/core/domains/http/context/HttpContext"
import { TRouteItem } from "@src/core/domains/http/interfaces/IRouter"

export interface ControllerConstructor {
    new (context: HttpContext): IController
    executeAction(action: string, context: HttpContext): Promise<void>
}

export interface IController {
    setContext(context: HttpContext): void
    getRouteOptions(): TRouteItem | undefined
}
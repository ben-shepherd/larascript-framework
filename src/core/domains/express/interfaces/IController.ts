/* eslint-disable no-unused-vars */
import HttpContext from "../data/HttpContext"

export interface ControllerConstructor {
    new (context: HttpContext): IController
}

export interface IController {
    setContext(context: HttpContext): void
}
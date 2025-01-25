/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";

import HttpContext from "../data/HttpContext";

export type MiddlewareConstructor = {
    new (...args: any[]): IMiddleware;
    toExpressMiddleware(): TExpressMiddlewareFn;
}

export interface IMiddleware {
    getExpressMiddleware(): TExpressMiddlewareFn;
    getContext(): HttpContext;
    execute(context: HttpContext): Promise<void>;
    next(): void;
}

/**
 * Represents an Express middleware function. The function takes an Express Request,
 * Response, and NextFunction as arguments and may return a Promise that resolves
 * to void or may return void directly.
 *
 * @param req - The Express Request object
 * @param res - The Express Response object
 * @param next - The Express NextFunction object
 * @returns A Promise that resolves to void or void directly
 */
export type TExpressMiddlewareFn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

import { NextFunction, Response } from "express";

import HttpContext from "../data/HttpContext";
import { IMiddleware, MiddlewareConstructor, TExpressMiddlewareFn } from "../interfaces/IMiddleware";
import { BaseRequest } from "../types/BaseRequest.t";


abstract class Middleware<Config extends unknown = unknown> implements IMiddleware {

    /**
     * @type {Config}
     */
    protected config!: Config;

    /**
     * @type {HttpContext}
     */
    protected context!: HttpContext;

    /**
     * Converts this middleware class into an Express-compatible middleware function.
     * Creates a new instance of this class and returns its Express middleware function,
     * allowing it to be used directly with Express's app.use() or route handlers.
     * 
     * @returns {TMiddlewareFn} An Express middleware function that takes (req, res, next)
     */
    public static toExpressMiddleware() {
        return new (this as unknown as MiddlewareConstructor)().getExpressMiddleware()
    }

    /**
     * @param {Config} config
     */
    public setConfig(config: Config) {
        this.config = config;
    }

    /**
     * @returns {Config}
     */
    public getConfig(): Config {
        if(!this.config) {
            throw new Error('Config not set');
        }

        return this.config;
    }

    /**
     * @param {HttpContext} context
     */
    public setContext(context: HttpContext) {
        this.context = context;
    }

    /**
     * @returns {HttpContext}
     */
    public getContext(): HttpContext {
        return this.context;
    }

    /**
     * Executes the next middleware function in the chain by calling
     * the stored next() callback from the HttpContext
     */
    public next(): void {
        this.context.getNext()?.();
    }

    /**
     * @returns {ExpressMiddlewareFn}
     */
    public getExpressMiddleware(): TExpressMiddlewareFn {
        return async (req: BaseRequest, res: Response, next: NextFunction) => {
            const context = new HttpContext(req, res, next)
            this.setContext(context)
            await this.execute(context)
        }
    }

    /**
     * @abstract
     * @param {HttpContext} context
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line no-unused-vars
    public abstract execute(context: HttpContext): Promise<void>;

}

export default Middleware;
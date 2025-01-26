import HttpContext from "@src/core/domains/express/data/HttpContext";
import { IMiddleware, MiddlewareConstructor, TExpressMiddlewareFn } from "@src/core/domains/express/interfaces/IMiddleware";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { NextFunction, Response } from "express";
import { IExpressable } from "@src/core/domains/express/interfaces/IExpressable";


abstract class Middleware<Config extends unknown = unknown> implements IMiddleware, IExpressable<TExpressMiddlewareFn> {

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
     */
    public static toExpressMiddleware(): TExpressMiddlewareFn {
        return new (this as unknown as MiddlewareConstructor)().toExpressable()
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
     * @returns {TExpressMiddlewareFn}
     */
    public toExpressable(): TExpressMiddlewareFn {
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
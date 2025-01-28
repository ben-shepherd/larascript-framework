import HttpContext from "@src/core/domains/express/data/HttpContext";
import { IExpressable } from "@src/core/domains/express/interfaces/IExpressable";
import { IMiddleware, MiddlewareConstructor, TExpressMiddlewareFn } from "@src/core/domains/express/interfaces/IMiddleware";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { NextFunction, Response } from "express";
import { TRouteItem } from "@src/core/domains/express/interfaces/IRoute";

/**
 * Abstract base class that transforms Express middleware into a class-based format.
 * 
 * This class provides an object-oriented way to write Express middleware by:
 * 
 * 1. Converting the function-based middleware pattern (req, res, next) into a class
 *    with an execute() method that receives a unified HttpContext
 * 
 * 2. Adding type-safe configuration management through generics and config methods
 * 
 * 3. Providing static and instance methods to convert back to Express middleware format
 *    when needed (toExpressMiddleware() and toExpressable())
 * 
 * Example usage:
 * ```
 * class LoggerMiddleware extends Middleware {
 *   async execute(context: HttpContext) {
 *     console.log(`${context.getRequest().method}: ${context.getRequest().path}`);
 *     this.next();
 *   }
 * }
 * 
 * // Use with Express
 * app.use(LoggerMiddleware.toExpressMiddleware())
 * ```
 * 
 * This abstraction helps organize middleware code into maintainable, testable classes
 * while maintaining full compatibility with Express's middleware system.
 */

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
    public static toExpressMiddleware(routeItem?: TRouteItem): TExpressMiddlewareFn {
        return new (this as unknown as MiddlewareConstructor)().toExpressable(routeItem)
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
    public toExpressable(routeItem?: TRouteItem): TExpressMiddlewareFn {
        return async (req: BaseRequest, res: Response, next: NextFunction | undefined) => {
            const context = new HttpContext(req, res, next, routeItem)
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
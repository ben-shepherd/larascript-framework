import Middleware from '../base/Middleware';
import { MiddlewareConstructor, TExpressMiddlewareFn, TExpressMiddlewareFnOrClass } from '../interfaces/IMiddleware';

class MiddlewareUtil {

    /**
     * Converts an array of middleware classes and middleware functions into an array of Express middleware functions.
     * 
     * @param routeItem The route item containing the middlewares
     * @returns An array of Express middleware functions
     */
    static convertToExpressMiddlewares(fnAndClassMiddlewares: TExpressMiddlewareFnOrClass[]): TExpressMiddlewareFn[] {

        // A mix of middleware classes and middleware functions
        const middlewaresArray = (
            Array.isArray(fnAndClassMiddlewares) 
                ? fnAndClassMiddlewares 
                : [fnAndClassMiddlewares]
        ) as TExpressMiddlewareFnOrClass[]

        // Convert middleware classes to middleware functions
        return middlewaresArray.map(middleware => {
            if(middleware.prototype instanceof Middleware) {
                return (middleware as MiddlewareConstructor).toExpressMiddleware()
            }

            return middleware as TExpressMiddlewareFn
        })
    } 

}

export default MiddlewareUtil;
import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import responseError from '@src/core/domains/http/handlers/responseError';

class ValidationMiddleware extends Middleware<{ scopes: string[] }> {

    async execute(context: HttpContext): Promise<void> {
        try {

            
        }
        catch (error) {

            if(error instanceof Error) {
                responseError(context.getRequest(), context.getResponse(), error)
                return;
            } 
        }
    }

}

export default ValidationMiddleware;
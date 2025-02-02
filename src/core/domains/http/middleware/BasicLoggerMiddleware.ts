import Middleware from '@src/core/domains/http/base/Middleware';
import HttpContext from '@src/core/domains/http/context/HttpContext';
import { App } from '@src/core/services/App';

class BasicLoggerMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {

        App.container('logger').info('New request: ', `${context.getRequest().method} ${context.getRequest().url}`, 'Headers: ', context.getRequest().headers);

        this.next();
    }

}

export default BasicLoggerMiddleware;


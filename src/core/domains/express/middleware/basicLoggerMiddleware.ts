import { App } from '@src/core/services/App';

import Middleware from '../base/Middleware';
import HttpContext from '../data/HttpContext';

class BasicLoggerMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {

        App.container('logger').info('New request: ', `${context.getRequest().method} ${context.getRequest().url}`, 'Headers: ', context.getRequest().headers);

        this.next();
    }

}

export default BasicLoggerMiddleware;


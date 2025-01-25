import { NextFunction, Response } from 'express';

import { BaseRequest } from '../types/BaseRequest.t';

class HttpContext {

    constructor(
        // eslint-disable-next-line no-unused-vars
        protected req: BaseRequest,
        // eslint-disable-next-line no-unused-vars
        protected res: Response,
        // eslint-disable-next-line no-unused-vars
        protected nextFn: NextFunction | undefined
    ) {
    }

    public getRequest(): BaseRequest {
        return this.req;
    }

    public getResponse(): Response {
        return this.res;
    }

    public getNext(): NextFunction | undefined {
        return this.nextFn;
    }

}

export default HttpContext;
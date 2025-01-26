import { BaseRequest } from '@src/core/domains/express/types/BaseRequest.t';
import { NextFunction, Response } from 'express';
import HttpContextException from '@src/core/domains/express/exceptions/HttpContextException';
import { requestContext } from '@src/core/domains/express/services/RequestContext';

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

    /**
     * Gets the request context.
     * @returns {RequestContext | undefined} The request context.
     */
    public getByRequest<T = unknown>(key: string): T | undefined {
        return requestContext().getByRequest<T>(this.req, key)
    }

    /**
     * Sets the request context.
     * @param {string} key - The key of the value to set.
     * @param {unknown} value - The value to set.
     */
    public setContext(key: string, value: unknown): void {
        requestContext().setByRequest(this.req, key, value)
    }

    /**
     * Gets the IP context.
     * @param {string} key - The key of the value to get.
     * @returns {unknown} The value of the IP context.
     */
    public getIpContext<T = unknown>(key: string): T | undefined {
        return requestContext().getByIpAddress<T>(this.req, key)
    }

    /**
     * Sets the IP context.
     * @param {string} key - The key of the value to set.
     * @param {unknown} value - The value to set.
     */
    public setIpContext(key: string, value: unknown): void {
        requestContext().setByIpAddress(this.req, key, value)
    }

    /**
     * Gets the ID of the current request.
     * @returns {string} The ID of the current request.
     */
    public getId(): string {
        if(!this.req.id) {
            throw new HttpContextException('Request ID not found');
        }
        return this.req.id;
    }

    /**
     * Gets the request object.
     * @returns {BaseRequest} The request object.
     */
    public getRequest(): BaseRequest {
        return this.req;
    }

    /**
     * Gets the response object.
     * @returns {Response} The response object.
     */
    public getResponse(): Response {
        return this.res;
    }

    /**
     * Gets the next function.
     * @returns {NextFunction | undefined} The next function.
     */
    public getNext(): NextFunction | undefined {
        return this.nextFn;
    }

}

export default HttpContext;
import HttpContextException from '@src/core/domains/express/exceptions/HttpContextException';
import { requestContext } from '@src/core/domains/http/context/RequestContext';
import { TBaseRequest } from '@src/core/domains/http/interfaces/BaseRequest';
import { TRouteItem } from '@src/core/domains/http/interfaces/IRouter';
import { NextFunction, Response } from 'express';
import { IUserModel } from '@src/core/domains/auth/interfaces/models/IUserModel';
import { IApiTokenModel } from '@src/core/domains/auth/interfaces/models/IApiTokenModel';



class HttpContext {

    constructor(
        // eslint-disable-next-line no-unused-vars
        protected req: TBaseRequest,
        // eslint-disable-next-line no-unused-vars
        protected res: Response,
        // eslint-disable-next-line no-unused-vars
        protected nextFn?: NextFunction,
        // eslint-disable-next-line no-unused-vars
        protected routeItem?: TRouteItem

    ) {
    }
    
    /**
     * Gets the route item of the request.
     * @returns {TRouteItem} The route item of the request.
     */
    public getRouteItem(): TRouteItem | undefined {
        return this.routeItem
    }

    /**
     * Gets the user of the request.
     * @returns {IUserModel | undefined} The user of the request.
     */
    public getUser(): IUserModel | undefined {
        return this.req?.user as IUserModel | undefined;
    }

    /**
     * Gets the API token of the request.
     * @returns {IApiTokenModel | undefined} The API token of the request.
     */
    public getApiToken(): IApiTokenModel | undefined {
        return this.req?.apiToken ?? undefined;
    }

    /**
     * Gets the method of the request.
     * @returns {string} The method of the request.
     */
    public getMethod() {
        return this.req.method
    }

    /**
     * Gets all parameters from the request.
     * @returns {Record<string, string>} The parameters.
     */
    public getParams() {
        return this.req.params
    }

    /**
     * Gets a parameter from the request.
     * @param {string} key - The key of the parameter to get.
     * @returns {string | undefined} The value of the parameter.
     */
    public getParam(key: string) {
        return this.req.params[key]
    }


    /**
     * Gets a query parameter from the request.
     * @param {string} key - The key of the query parameter to get.
     * @returns {string | undefined} The value of the query parameter.
     */


    public getQueryParam(key: string) {
        return this.req.query[key]
    }

    /**
     * Gets all query parameters from the request.
     * @returns {Record<string, string>} The query parameters.
     */
    public getQueryParams() {
        return this.req.query
    }

    /**
     * Gets all body parameters from the request.
     * @returns {Record<string, string>} The body parameters.
     */
    public getBody() {
        return this.req.body
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
     * @returns {TBaseRequest} The request object.
     */
    public getRequest(): TBaseRequest {
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
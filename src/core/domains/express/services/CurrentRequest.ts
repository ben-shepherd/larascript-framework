import Singleton from "@src/core/base/Singleton";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import getIpAddress from "@src/core/domains/express/utils/getIpAddress";

/**
 * Allows you to store information during the duration of a request. Information is linked to the Request's UUID and is cleaned up after the request is finished.
 * You can also store information linked to an IP Address.
 */
class CurrentRequest extends Singleton {

    /**
     * Example of how the values object looks like:
     * {
     *     'uuid': {
     *         'key': 'value',
     *         'key2': 'value2'
     *     },
     *     '127.0.0.1': {
     *         'key': 'value',
     *     }
     * }
     */
    protected context: Record<string, Record<string, unknown>> = {};

    /**
     * Sets a value in the current request context
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to set
     * @param {unknown} value - The value associated with the key
     * @returns {typeof CurrentRequest} - The CurrentRequest class itself to enable chaining
     */
    public setByRequest(req: BaseRequest, key: string, value: unknown): this {
        const requestId = req.id as string;

        if (!this.context[requestId]) {
            this.context[requestId] = {}
        }

        this.context[requestId][key] = value;
        return this;
    }

    /**
     * Gets a value from the current request context
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to retrieve
     * @returns {T | undefined} - The value associated with the key, or undefined if not found
     */
    public getByRequest<T = unknown>(req: BaseRequest, key?: string): T | undefined {
        const requestId = req.id as string;

        if (!key) {
            return this.context[requestId] as T ?? undefined;
        }

        return this.context[requestId]?.[key] as T ?? undefined
    }

    /**
     * Sets a value in the current request context by the request's IP address
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to set
     * @param {unknown} value - The value associated with the key
     * @returns {typeof CurrentRequest} - The CurrentRequest class itself to enable chaining
     */
    public setByIpAddress(req: BaseRequest, key: string, value: unknown): this {
        const ip = getIpAddress(req);

        if (!this.context[ip]) {
            this.context[ip] = {}
        }

        this.context[ip][key] = value;
        return this;
    }

    /**
     * Gets a value from the current request context by the request's IP address
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} [key] - The key of the value to retrieve
     * @returns {T | undefined} - The value associated with the key, or undefined if not found
     */
    public getByIpAddress<T = unknown>(req: BaseRequest, key?: string): T | undefined {
        const ip = getIpAddress(req);

        if (!key) {
            return this.context[ip] as T ?? undefined;
        }

        return this.context[ip]?.[key] as T ?? undefined
    }

    /**
     * Ends the current request context and removes all associated values
     *
     * @param {BaseRequest} req - The Express Request object
     * @returns {void}
     */
    public endRequest(req: BaseRequest) {
        const requestId = req.id as string;
        delete this.context[requestId];
    }

    /**
     * Returns the current request context data
     *
     * @returns {Record<string, unknown>} - The current request context data
     */
    public getContext() {
        return this.context
    }

}

export default CurrentRequest
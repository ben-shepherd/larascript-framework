import Singleton from "@src/core/base/Singleton";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

import getIpAddress from "../utils/getIpAddress";

const example = {
    'uuid': {
        'key': 'value',
        'key2': 'value2'
    },
    '127.0.0.1': {
        'key': 'value',
    }
}

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
    public values: Record<string, Record<string, unknown>> = {};

    /**
     * Sets a value in the current request context
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to set
     * @param {unknown} value - The value associated with the key
     * @returns {typeof CurrentRequest} - The CurrentRequest class itself to enable chaining
     */
    public static setByRequest(req: BaseRequest, key: string, value: unknown): typeof CurrentRequest {
        const requestId = req.id as string;

        if (!this.getInstance().values[requestId]) {
            this.getInstance().values[requestId] = {}
        }

        this.getInstance().values[requestId][key] = value;
        return this;
    }

    /**
     * Gets a value from the current request context
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to retrieve
     * @returns {T | undefined} - The value associated with the key, or undefined if not found
     */
    public static getByRequest<T = unknown>(req: BaseRequest, key?: string): T | undefined {
        const requestId = req.id as string;

        if (!key) {
            return this.getInstance().values[requestId] as T ?? undefined;
        }

        return this.getInstance().values[requestId]?.[key] as T ?? undefined
    }

    /**
     * Sets a value in the current request context by the request's IP address
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to set
     * @param {unknown} value - The value associated with the key
     * @returns {typeof CurrentRequest} - The CurrentRequest class itself to enable chaining
     */
    public static setByIpAddress(req: BaseRequest, key: string, value: unknown): typeof CurrentRequest {
        const ip = getIpAddress(req);

        if (!this.getInstance().values[ip]) {
            this.getInstance().values[ip] = {}
        }

        this.getInstance().values[ip][key] = value;
        return this;
    }

    /**
     * Gets a value from the current request context by the request's IP address
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} [key] - The key of the value to retrieve
     * @returns {T | undefined} - The value associated with the key, or undefined if not found
     */
    public static getByIpAddress<T = unknown>(req: BaseRequest, key?: string): T | undefined {
        const ip = getIpAddress(req);

        if (!key) {
            return this.getInstance().values[ip] as T ?? undefined;
        }

        return this.getInstance().values[ip]?.[key] as T ?? undefined
    }

    /**
     * Ends the current request context and removes all associated values
     *
     * @param {BaseRequest} req - The Express Request object
     * @returns {void}
     */
    public static end(req: BaseRequest) {
        const requestId = req.id as string;
        delete this.getInstance().values[requestId];

        // const ip = getIpAddress(req);
        // delete this.getInstance().values[ip];
    }

}

export default CurrentRequest
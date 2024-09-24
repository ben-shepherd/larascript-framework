import Singleton from "@src/core/base/Singleton";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";

class CurrentRequest extends Singleton {

    protected values: Record<string, Record<string, unknown>> = {};

    /**
     * Sets a value in the current request context
     *
     * @param {BaseRequest} req - The Express Request object
     * @param {string} key - The key of the value to set
     * @param {unknown} value - The value associated with the key
     * @returns {typeof CurrentRequest} - The CurrentRequest class itself to enable chaining
     */
    public static set(req: BaseRequest, key: string, value: unknown): typeof CurrentRequest {
        const requestId = req.id as string;
        
        if(!this.getInstance().values[requestId]) {
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
    public static get<T = unknown>(req: BaseRequest, key: string): T | undefined {
        const requestId = req.id as string;
        return this.getInstance().values[requestId]?.[key] as T ?? undefined
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
    }

}

export default CurrentRequest
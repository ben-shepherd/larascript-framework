import Singleton from "@src/core/base/Singleton";
import { IPContextData, IPDatesArrayTTL } from "@src/core/domains/express/interfaces/ICurrentRequest";
import { ICurrentRequestCleanUpConfig } from "@src/core/domains/express/interfaces/ICurrentRequestCleanUpConfig";
import { App } from "@src/core/services/App";

/**
 * A class that handles cleaning up expired items from the current IP context.
 */
class RequestContextCleaner extends Singleton {

    /**
     * Starts the cleanup process. This will run an interval every N seconds specified in the config.
     * If no delay is specified, it will default to 60 seconds.
     * 
     * @param {ICurrentRequestCleanUpConfig} config The configuration for the cleanup process.
     */
    public static boot(config: ICurrentRequestCleanUpConfig) {
        const instance = this.getInstance();
        
        const delayInSeconds = config.delayInSeconds ?? 60;

        setInterval(() => {
            instance.scan();
        }, delayInSeconds * 1000);
    }

    /**
     * Scans the current IP context and removes expired items from it.
     * This is done by checking the TTL of each item in the context and
     * removing the ones that have expired. If the context is empty after
     * removing expired items, it is removed from the store as well.
     */
    scan() {
        // Get the entire current IP context
        let context = App.container('requestContext').getIpContext() as IPContextData<Date[]>;

        // Loop through the context and handle each IP
        for(const [ip, ipContext] of context.entries()) {
            context = this.handleIpContext(ip, ipContext, context);
        }

        // Set the updated IP context
        App.container('requestContext').setIpContext(context);
    }

    /**
     * Handles a single IP context by removing expired items from it.
     * This is done by checking the TTL of each item in the context and
     * removing the ones that have expired. If the context is empty after
     * removing expired items, it is removed from the store as well.
     * 
     * @param {string} ip - The IP address of the context to handle.
     * @param {Map<string, IPDatesArrayTTL<Date[]>>} ipContext - The IP context to handle.
     * @param {IPContextData<Date[]>} context - The current IP context.
     * @returns {IPContextData<Date[]>} - The updated IP context.
     */
    protected handleIpContext(ip: string, ipContext: Map<string, IPDatesArrayTTL<Date[]>>, context: IPContextData<Date[]>): IPContextData<Date[]> {
        const now = new Date();

        // Loop through the IP context and remove expired items
        for(const [key, item] of ipContext.entries()) {

            // If the TTL is not a number, skip this item
            if(typeof item.ttlSeconds !== 'number') continue;

            // Check if the dates are in the past, remove them if true.
            for(const date of item.value) {

                const expiresAt = new Date(date);
                expiresAt.setSeconds(expiresAt.getSeconds() + item.ttlSeconds);

                // Remove expired items
                if(now > expiresAt) {
                    ipContext.delete(key);
                }

                // Update size
                context.set(ip, ipContext)
            }

            // If the context is empty, remove it from the store
            if(context.size === 0) {
                console.log('Removed ipContext', ip)
                context.delete(ip)
            }
        }

        // Return the updated IP context
        return context
    }

}

export default RequestContextCleaner
import { IProvider } from "@src/core/interfaces/IProvider";
import { App } from "@src/core/services/App";

/**
 * Base class for providers
 *
 * @abstract
 */
export default abstract class BaseProvider implements IProvider {

    /**
     * The name of the provider
     *
     * @protected
     */
    protected providerName: string | null = null;

    /**
     * The configuration for the provider
     *
     * @protected
     */
    protected config: any = {};

    /**
     * Registers the provider
     *
     * @abstract
     * @returns {Promise<void>}
     */
    abstract register(): Promise<void>;

    /**
     * Boots the provider
     *
     * @abstract
     * @returns {Promise<void>}
     */
    abstract boot(): Promise<void>;

    /**
     * Logs a message to the console
     *
     * @protected
     * @param {string} message - The message to log
     * @param {...any[]} args - Additional arguments to log
     */
    protected log(message: string, ...args: any[]): void {
        App.container('logger').info(message, ...args);
    }

    /**
     * Gets the name of the provider
     *
     * @returns {string|null} - The name of the provider, or null if not set
     */
    public getProviderName(): string | null {
        return this.providerName;
    }

}

import { IFormatter } from "@src/core/domains/formatter/interfaces/IFormatter"

abstract class BaseFormatter<Options = unknown> implements IFormatter<Options> {

    /**
     * The formatter options.
     */
    formatterOptions?: Options

    // eslint-disable-next-line no-unused-vars
    abstract format<T = unknown>(...args: any[]): T;

    /**
     * Sets the formatter options.
     * @param options The options to set.
     * @returns {this} The formatter instance.
     */
    setFormatterOptions(options?: Options): this {
        this.formatterOptions = options
        return this
    }

    /**
     * Gets the formatter options.
     * @returns {Options | undefined} The formatter options.
     */
    getFormatterOptions(): Options | undefined {
        return this.formatterOptions
    }

}

export default BaseFormatter
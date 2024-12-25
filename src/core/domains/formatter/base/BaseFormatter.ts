import { IFormatter } from "../interfaces/IFormatter"

abstract class BaseFormatter<Options = unknown> implements IFormatter<Options> {

    formatterOptions?: Options

    // eslint-disable-next-line no-unused-vars
    abstract format<T = unknown>(...args: any[]): T;

    setFormatterOptions(options?: Options): this {
        this.formatterOptions = options
        return this
    }

    getFormatterOptions(): Options | undefined {
        return this.formatterOptions
    }

}

export default BaseFormatter
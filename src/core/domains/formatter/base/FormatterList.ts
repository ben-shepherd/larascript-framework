import { ICtor } from "@src/core/interfaces/ICtor"

import { IFormatter } from "../interfaces/IFormatter"

/**
 * A list of formatters.
 */
class FormatterList {

    protected formatters: ICtor<IFormatter>[] = []

    /**
     * Sets the formatter.
     * @param formatter The formatter to set.
     * @returns The formatter list.
     */
    public setFormatter(formatter: ICtor<IFormatter>): this {
        this.formatters.push(formatter)
        return this
    }

    /**
     * Gets the formatter.
     * @returns The formatter.
     */
    public getFormatter(): ICtor<IFormatter>[] {
        return this.formatters
    }

    /**
     * Adds a formatter.
     * @param formatter The formatter to add.
     * @returns The formatter list.
     */
    public addFormatter(formatter: ICtor<IFormatter>): this {
        this.formatters.push(formatter)
        return this
    }

    /**
     * Formats the data.
     * @param data The data to format.
     * @returns The formatted data.
     */
    public format(data: unknown): unknown {   
        return this.formatters.reduce((acc, formatterConstructor) => {
            const formatter = new formatterConstructor()
            return formatter.format(acc)
        }, data)
    }

    public formatArray(data: unknown[]): unknown[] {
        return data.map(item => this.format(item))
    }

}

export default FormatterList
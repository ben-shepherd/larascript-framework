abstract class AbstractRule<TOptions extends object = object> {

    protected options: TOptions = {} as TOptions

    protected attributes: Record<string, unknown> = {}

    public setOptions(options: TOptions): this {
        this.options = options
        return this
    }

    public setAttributes(attributes: Record<string, unknown>): this {
        this.attributes = attributes
        return this
    }

    public getAttribute(key: string): unknown {
        return this.attributes[key]
    }

    public getOption(key: string): unknown {
        return this.options[key]
    }


}

export default AbstractRule;





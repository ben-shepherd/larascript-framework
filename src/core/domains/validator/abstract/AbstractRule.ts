import forceString from "@src/core/util/str/forceString";

import { logger } from "../../logger/services/LoggerService";
import { IRuleError } from "../interfaces/IRule";

abstract class AbstractRule<TOptions extends object = object> {

    protected abstract name: string;

    protected abstract errorTemplate: string;

    protected defaultError: string = 'This field is invalid.'

    protected options: TOptions = {} as TOptions

    protected data: unknown = undefined

    protected attributes: unknown = undefined

    protected field!: string;



    public abstract getError(): IRuleError;

    public setOptions(options: TOptions): this {
        this.options = options
        return this
    }


    public setData(data: unknown): this {
        this.data = data
        return this
    }

    public getData(): unknown {
        return this.data
    }

    public setField(field: string): this {
        this.field = field
        return this
    }

    public setAttributes(attributes: unknown): this {
        this.attributes = attributes
        return this
    }

    public getAttributes(): unknown {
        return this.attributes
    }

    public getOption(key: string): unknown {
        return this.options[key]
    }

    public getName(): string {
        return this.name
    }

    protected getErrorTemplate(): string {
        return this.errorTemplate
    }

    protected buildError(replace?: Record<string, unknown>): string {
        try {
            let error = this.errorTemplate.replace(':attribute', this.field)

            if (!replace) {
                return error
            }

            for (const [key, value] of Object.entries(replace)) {
                error = error.replace(`:${key}`, forceString(value))
            }


            return error
        }
        catch (err) {
            logger().exception(err as Error)
            return this.defaultError
        }
    }


}

export default AbstractRule;






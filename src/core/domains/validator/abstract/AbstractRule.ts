import forceString from "@src/core/util/str/forceString";

import { logger } from "../../logger/services/LoggerService";
import { IRuleError } from "../interfaces/IRule";

abstract class AbstractRule<TOptions extends object = object> {

    protected abstract name: string;

    protected abstract errorTemplate: string;

    protected defaultError: string = 'This field is invalid.'

    protected options: TOptions = {} as TOptions

    protected attributes: Record<string, unknown> = {}

    protected field!: string;

    public abstract getError(): IRuleError;

    public setOptions(options: TOptions): this {
        this.options = options
        return this
    }


    public setAttributes(attributes: Record<string, unknown>): this {
        this.attributes = attributes
        return this
    }

    public setField(field: string): this {
        this.field = field
        return this
    }

    public getAttribute(key: string): unknown {
        return this.attributes[key]
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






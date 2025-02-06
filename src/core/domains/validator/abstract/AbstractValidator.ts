import { IRule } from "../interfaces/IRule";

abstract class AbstractValidator {

    protected rules: IRule[] = [];

    protected messages: Record<string, string> = {};

    abstract validate(value: unknown): boolean;

    public setRules(rules: IRule[]): this {
        this.rules = rules;
        return this;
    }

    public setMessages(messages: Record<string, string>): this {
        this.messages = messages;
        return this;
    }


}

export default AbstractValidator;

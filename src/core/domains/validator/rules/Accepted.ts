import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class Accepted extends AbstractRule implements IRule {

    public validate(value: unknown): boolean {
        return value === true || value === 'true' || value === 1 || value === '1';
    }

}

export default Accepted;

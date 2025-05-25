
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";


class MultipleFilesRule extends AbstractRule implements IRule {

    protected name: string = 'required'

    protected errorTemplate: string = 'The :attribute field expects multiple files.';

    public async test(): Promise<boolean> {
        const files = this.getHttpContext().getFiles(this.getAttribute()) ?? []

        return files?.length >= 1
    }

}


export default MultipleFilesRule;

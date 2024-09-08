import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeValidatorCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:validator',
            description: 'Create a validator',
            makeType: 'Validator',
            args: ['name'],
            endsWith: 'Validator',
            startWithLowercase: false
        })
    }

}
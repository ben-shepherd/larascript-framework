import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeValidatorCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:factory',
            description: 'Create a factory',
            makeType: 'Factory',
            args: ['name'],
            endsWith: 'Factory',
            startWithLowercase: false
        })
    }

}
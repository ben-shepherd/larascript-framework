import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeModelCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:model',
            description: 'Create a new model',
            makeType: 'Model',
            endsWith: 'Model',
            args: ['name', 'collection'],
            argsOptional: ['collection'],
        })
    }

}
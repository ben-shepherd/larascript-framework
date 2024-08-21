import BaseMakeFileCommand from "../base/BaseMakeFileCommand";

export default class MakeModelCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:model',
            description: 'Create a new model',
            makeType: 'Model',
            args: ['name', 'collection'],
        })
    }
}
import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeModelCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:model', 'Create a new model', 'Model', ['name', 'collection']);
    }
}
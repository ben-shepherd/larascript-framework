import GenericMakeFileCommand from "@src/core/domains/make/base/GenericMakeFileCommand";

export default class MakeListenerCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:action', 'Create a new action', 'Action', ['name'], {
            endsWith: 'Action',
            startWithLowercase: true
        });
    }
}
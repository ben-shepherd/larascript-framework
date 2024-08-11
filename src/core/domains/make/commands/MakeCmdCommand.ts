import GenericMakeFileCommand from "@src/core/domains/make/base/GenericMakeFileCommand";

export default class MakeCmdCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:command', 'Create a command', 'Command', ['name'], {
            endsWith: 'Command'
        });
    }
}
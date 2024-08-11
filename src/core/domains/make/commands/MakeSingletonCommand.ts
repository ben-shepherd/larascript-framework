import GenericMakeFileCommand from "@src/core/domains/make/base/GenericMakeFileCommand";

export default class MakeSingletonCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:singleton', 'Create a singleton service', 'Singleton', ['name'], {
            endsWith: 'Singleton'
        });
    }
}
import GenericMakeFileCommand from "@src/core/domains/Make/base/GenericMakeFileCommand";

export default class MakeRepositoryCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:repository', 'Create a new repository', 'Repository', ['name', 'collection'], {
            endsWith: 'Repository'
        });
    }
}
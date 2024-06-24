import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeRepositoryCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:repository', 'Create a new repository', 'Repository');
    }
}
import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeProviderCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:provider', 'Create a provider', 'Provider', ['name'], {
            endsWith: 'Provider'
        });
    }
}
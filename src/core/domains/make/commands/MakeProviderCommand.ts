import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeProviderCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:provider',
            description: 'Create a new provider',
            makeType: 'Provider',
            args: ['name'],
            endsWith: 'Provider'
        })
    }
}
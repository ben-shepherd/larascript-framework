import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeRepositoryCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:repository',
            description: 'Create a new repository',
            makeType: 'Repository',
            args: ['name', 'collection'],
            endsWith: 'Repository'
        })
    }

}
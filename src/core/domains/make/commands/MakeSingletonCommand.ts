import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeSingletonCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:singleton',
            description: 'Create a new singleton service',
            makeType: 'Singleton',
            args: ['name'],
            endsWith: 'Singleton'
        })
    }
}
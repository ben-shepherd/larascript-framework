import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeObserverCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:observer',
            description: 'Create a new observer',
            makeType: 'Observer',
            args: ['name'],
            endsWith: 'Observer'
        })
    }
}
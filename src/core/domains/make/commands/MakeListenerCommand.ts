import BaseMakeFileCommand from "../base/BaseMakeFileCommand";

export default class MakeListenerCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:listener',
            description: 'Create a new listener',
            makeType: 'Listener',
            args: ['name'],
            endsWith: 'Listener'
        })
    }
}
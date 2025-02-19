import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeListenerCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:listener',
            description: 'Create a new listener event',
            makeType: 'Listener',
            args: ['name'],
            endsWith: 'ListenerEvent'
        })
    }

}
import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeEventCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:event',
            description: 'Create a new subscriber event',
            makeType: 'Subscriber',
            args: ['name'],
            endsWith: 'SubscriberEvent'
        })
    }

}
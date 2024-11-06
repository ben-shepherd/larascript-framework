import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeSubscriberCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:subscriber',
            description: 'Create a new subscriber event',
            makeType: 'Subscriber',
            args: ['name'],
            endsWith: 'Subscriber'
        })
    }

}